import type { RequestHandler } from 'express';
import { Cart_Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    if(!session.user){
        res.redirect('/login');
        return;
    }
    let items = await db.getRepository(Cart_Product).find({ where: [{user: session.user }] , relations: ["product"] });
    res.render('pages/cart', { User: session.user, quantity: quantity, sum: sum, items: items });
};