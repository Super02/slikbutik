import type { RequestHandler } from 'express';
import { Cart_Product, User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    const user = await db.getRepository(User).findOne({ where: {id: session.user.id } });
    if (user) {
        const items = await db.getRepository(Cart_Product).find({ where: [{ user: user }] });
        items.forEach(async (item) => {
            await db.getRepository(Cart_Product).delete({ id: item.id });
        });
        session.quantity = 0;
        session.sum = 0;
        res.redirect('/cart');
    } else {
        res.render('pages/cart', { error: "User does not exist" });
    }
};
