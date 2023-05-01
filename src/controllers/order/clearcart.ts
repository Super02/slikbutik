import type { RequestHandler } from 'express';
import { Cart_Product, User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
if(!session.user){
        res.redirect('/login');
        return;
    }
    let user = await db.getRepository(User).findOne({ where: [{id: session.user.id }], relations: ["cart"] });
    if (user) {
        user.cart = [];
        await db.getRepository(User).save(user);
        // Delete cart products
        await db.getRepository(Cart_Product).delete({ user: user });
        res.redirect('/cart');
    } else {
        res.render('pages/cart', { error: "User does not exist" , User: session.user, quantity: quantity, sum: sum});
    }
};
