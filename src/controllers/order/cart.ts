import type { RequestHandler } from 'express';
import { Cart_Product, User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
export const get: RequestHandler = async (req, res) => {
    const user = await db.getRepository(User).findOne({ where: {id: session.user.id } });
    // Find all products in cart without getting RangeError: Maximum call stack size exceeded

    const items = await db.getRepository(Cart_Product).find({ where: [{ user: user }], relations: ["product"] });
    // Get total quantity for user
    let quantity = 0;
    let sum = 0;
    items.forEach((item) => {
        quantity += item.quantity;
    });
    items.forEach((item) => {
        if(item.product === null) {
            return;
        }
        sum += item.quantity * item.product[0].price;
    });
    session.quantity = quantity;
    session.sum = sum;
    return res.render('pages/cart', { items: items });
};