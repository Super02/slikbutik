import type { RequestHandler } from 'express';
import { Order, User, Cart_Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    if (!session.user) {
        res.redirect('/login');
        return;
    }
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }], relations: ["cart"] });
    if (user) {
        const newOrder = new Order();
        newOrder.user = user;
        newOrder.order = user.cart;
        newOrder.total = sum;
        await db.getRepository(Order).save(newOrder);
        // Assign all cart_products to be null
        const cart_products = await db.getRepository(Cart_Product).find({ where: [{ user: session.user }] });
        for (let i = 0; i < cart_products.length; i++) {
            cart_products[i].user = null;
            await db.getRepository(Cart_Product).save(cart_products[i]);
        }
        user.cart = [];
        await db.getRepository(User).save(user);
        res.redirect('/products');
    } else {
        res.render('pages/index', { error: "Unauthorized", User: session.user, quantity: quantity, sum: sum });
    }
};