import type { RequestHandler } from 'express';
import { User, Product, Order, Cart_Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');


export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: session.user.username }] });
    if (user.permission > 0) {
        if(req.body.user_id !== undefined) {
            console.log("deleting user")
            // Delete all cart_products with the order id
            const user = await db.getRepository(User).findOne({ where: [{ id: parseInt(req.body.user_id) }] });
            const orders = await db.getRepository(Order).find({ where: { user: user }, relations: ["order"] });
            const items = await db.getRepository(Cart_Product).find({ where: { user: user } });
            items.forEach(async (item) => {
                await db.getRepository(Cart_Product).delete({ id: item.id });
            });
            orders.forEach(async (order) => {
                order.order.forEach(async (item) => {
                    await db.getRepository(Cart_Product).delete({ id: item.id });
                });
                await db.getRepository(Order).delete({ id: order.id });
            });
            await db.getRepository(User).delete({ id: user.id });
            if(session.user.id === user.id) {
                session.user = null;
            }
            return res.redirect('/');
        } else if(req.body.price !== undefined) {
            const newProduct = new Product();
            newProduct.name = req.body.name;
            newProduct.img = req.body.image_url;
            newProduct.description = req.body.description;
            newProduct.price = req.body.price;
            await db.getRepository(Product).save(newProduct);
            res.redirect('/products');
        } else if(req.body.delete_product !== undefined) {
            const product = await db.getRepository(Product).findOne({ where: { id: parseInt(req.body.delete_product) } });
            await db.getRepository(Product).delete({ id: product.id });
            res.redirect('/products');
        } else {
            res.render('pages/index', { error: "Unknown action" });
        }
    } else {
        res.redirect('/');
    }
};

export const get: RequestHandler = async (req, res) => {
    if(session.user.permission < 1){
        res.redirect('/products');
        return;
    }
    const orders = await db.getRepository(Order).find({relations: ["user", "order"]});
    const users = await db.getRepository(User).find();
    const products = await db.getRepository(Product).find();
    res.render('pages/admin', { orders: orders, users: users, products: products });
};