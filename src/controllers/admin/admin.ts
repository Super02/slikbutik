import type { RequestHandler } from 'express';
import { User, Product, Order } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;


export const post: RequestHandler = async (req, res) => {
    if(!session.user){
        res.redirect('/login');
        return;
    }
    let user = await db.getRepository(User).findOne({ where: [{username: session.user.username }] });
    if (user.permission > 0) {
        const newProduct = new Product();
        newProduct.name = req.body.name;
        newProduct.img = req.body.image_url;
        newProduct.description = req.body.description;
        newProduct.price = req.body.price;
        await db.getRepository(Product).save(newProduct);
        res.redirect('/products');
    } else {
        res.render('pages/index', { error: "Unauthorized" , User: session.user, quantity: quantity, sum: sum});
    }
};

export const get: RequestHandler = async (req, res) => {
    if(!session.user){
        res.redirect('/login');
        return;
    }
    if(session.user.permission < 1){
        res.redirect('/products');
        return;
    }
    const orders = await db.getRepository(Order).find({relations: ["user", "order"]});
    res.render('pages/admin', { User: session.user, quantity: quantity, sum: sum, orders: orders });
};