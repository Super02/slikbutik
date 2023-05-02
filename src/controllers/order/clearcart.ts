import type { RequestHandler } from 'express';
import { cartProduct, User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    const user = await db.getRepository(User).findOne({ where: {id: session.user.id } }); // Get the user
    if (user) {
        const items = await db.getRepository(cartProduct).find({ where: [{ user: user }] }); // Get all items in cart
        items.forEach(async (item) => {
            await db.getRepository(cartProduct).delete({ id: item.id }); // Delete all items in cart
        });
        session.quantity = 0;
        session.sum = 0;
        res.redirect('/cart');
    } else {
        res.render('pages/cart', { error: "User does not exist" });
    }
};
