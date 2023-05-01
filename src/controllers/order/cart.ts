import type { RequestHandler } from 'express';
import { Cart_Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    const user = session.user;
    if(!user){
        res.redirect('/login');
        return;
    }
    // Find all products in cart without getting RangeError: Maximum call stack size exceeded
    const items = await db.getRepository(Cart_Product).find({ where: [{ user: user }], relations: ["product"] });
    res.render('pages/cart', { User: user, quantity: quantity, sum: sum, items: items });
};