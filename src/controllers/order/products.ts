import type { RequestHandler } from 'express';
import { Cart_Product, Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    if (!session.user) {
        res.redirect('/login');
        return;
    }    // Get the products
    const products = await db.getRepository(Product).find();
    const user_products = await db.getRepository(Cart_Product).find({ where: [{ user: session.user }], relations: ["product"] });
    // Get total quantity for user
    quantity = 0;
    user_products.forEach((product) => {
        quantity += product.quantity;
    });
    sum = 0;
    user_products.forEach((product) => {
        console.log(product.product);
        if(product.product === null) {
            return;
        }
        sum += product.quantity * product.product[0].price;
    });
    return res.render('pages/products', { User: session.user, products: products, quantity: quantity, sum: sum });
};