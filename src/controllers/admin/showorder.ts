import type { RequestHandler } from 'express';
import { Cart_Product, User, Order } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    if (!session.user) {
        res.redirect('/login');
        return;
    }
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
    if (user.permission > 0) {
        let order = await db.getRepository(Order).findOne({ where: [{ id: parseInt(req.params.id) }], relations: ["order"] });
        if (order) {
            let cart_products = []
            for (let i = 0; i < order.order.length; i++) {
                let cart_product = await db.getRepository(Cart_Product).findOne({ where: [{ id: order.order[i].id }], relations: ["product"] });
                cart_products.push(cart_product);
            }
            res.render('pages/showorder', { User: session.user, order: cart_products, quantity: quantity, sum: sum });
        } else {
            res.render('pages/index', { error: "Unauthorized", User: session.user, quantity: quantity, sum: sum });
        }
    } else {
        res.render('pages/index', { error: "Unauthorized", User: session.user, quantity: quantity, sum: sum });
    }
};