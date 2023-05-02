import type { RequestHandler } from 'express';
import { Order, User, Cart_Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
    const cart_products = await db.getRepository(Cart_Product).find({ where: [{ user: session.user }] });
    if (user) {
        const newOrder = new Order();
        newOrder.user = user;
        newOrder.order = cart_products;
        newOrder.total = session.sum;
        console.log(newOrder)
        await db.getRepository(Order).save(newOrder);
        // Assign all cart_products to be null
        for (let i = 0; i < cart_products.length; i++) {
            cart_products[i].user = null;
            await db.getRepository(Cart_Product).save(cart_products[i]);
        }
        res.redirect('/products');
    } else {
        res.render('pages/index', { error: "Unauthorized" });
    }
};