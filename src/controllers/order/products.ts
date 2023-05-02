import type { RequestHandler } from 'express';
import { cartProduct, Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    // Get the products
    const products = await db.getRepository(Product).find();
    const user_products = await db.getRepository(cartProduct).find({ where: [{ user: session.user }], relations: ["product"] });
    // Get total quantity for user
    quantity = 0;
    user_products.forEach((product) => { // Get amount of items in cart
        quantity += product.quantity; 
    });
    sum = 0;
    user_products.forEach((product) => { 
        if(product.product === null) {
            return;
        }
        sum += product.quantity * product.product[0].price; // Get total price of items in cart
    });
    session.quantity = quantity; // Set session variables
    session.sum = sum; // Set session variables
    return res.render('pages/products', { products: products }); // Render products page and pass all of the products from the model
};