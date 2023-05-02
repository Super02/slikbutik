import type { RequestHandler } from 'express';
import { Cart_Product, User, Order } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
    if (user.permission > 0) {
        let order = await db.getRepository(Order).findOne({ where: [{ id: parseInt(req.params.id) }], relations: ["order"] });
        if (order) {
            let quantity = 0;
            let cart_products = []
            for (let i = 0; i < order.order.length; i++) {
                let cart_product = await db.getRepository(Cart_Product).findOne({ where: [{ id: order.order[i].id }], relations: ["product"] });
                quantity += cart_product.quantity;
                cart_products.push(cart_product);
            }
            const total = order.total;
            res.render('pages/showorder', { order: cart_products, quantity: quantity, total: total });
        } else {
            res.render('pages/index', { error: "Unauthorized" });
        }
    } else {
        res.render('pages/index', { error: "Unauthorized" });
    }
};

export const post: RequestHandler = async (req, res) => {
    // Delete all cart_products with the order id
    let order = await db.getRepository(Order).findOne({ where: [{ id: parseInt(req.params.id) }], relations: ["order"] });
    if (order) {
        for (let i = 0; i < order.order.length; i++) {
            await db.getRepository(Cart_Product).delete({ id: order.order[i].id });
        }
    }
    await db.getRepository(Order).delete({ id: parseInt(req.params.id) });
    res.redirect('/admin');
};