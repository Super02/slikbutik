import type { RequestHandler } from 'express';
import { cartProduct, User, Order } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] }); // Get the user
    if (user.permission > 0) {
        let order = await db.getRepository(Order).findOne({ where: [{ id: parseInt(req.params.id) }], relations: ["order"] }); // Get the order
        if (order) {
            let quantity = 0;
            let cartProducts = []
            for (let i = 0; i < order.order.length; i++) {
                let cart_Product = await db.getRepository(cartProduct).findOne({ where: [{ id: order.order[i].id }], relations: ["product"] }); // Get the cartProduct
                quantity += cart_Product.quantity; // Update the quantity
                cartProducts.push(cart_Product);
            }
            const total = order.total; // Set the total price
            res.render('pages/showorder', { order: cartProducts, quantity: quantity, total: total });
        } else {
            res.render('pages/index', { error: "Unauthorized" });
        }
    } else {
        res.render('pages/index', { error: "Unauthorized" });
    }
};

export const post: RequestHandler = async (req, res) => {
    // Delete all cartProducts with the order id
    let order = await db.getRepository(Order).findOne({ where: [{ id: parseInt(req.params.id) }], relations: ["order"] });
    if (order) {
        for (let i = 0; i < order.order.length; i++) {
            await db.getRepository(cartProduct).delete({ id: order.order[i].id }); // Delete the cartProduct (We have to delete this first due to relations)
        }
    }
    await db.getRepository(Order).delete({ id: parseInt(req.params.id) }); // Delete the order
    res.redirect('/admin');
};