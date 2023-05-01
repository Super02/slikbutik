import type { RequestHandler } from 'express';
import { Cart_Product, User, Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    if (!session.user) {
        res.redirect('/login');
        return;
    }
    const product = await db.getRepository(Product).findOne({ where: [{ id: parseInt(req.params.id) }] });
    if (product) {
        let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
        if (user) {
            // Check if product is already in cart
            let exist = await db.getRepository(Cart_Product).findOne({ where: [{ product: product, user: user }], relations: ["user"] });
            if (exist) {
                // Update quantity
                exist.quantity += req.body.quantity || 1;
                await db.getRepository(Cart_Product).save(exist);
                return res.redirect('/cart');
            }

            // Create cart product
            let cartProduct = new Cart_Product();
            cartProduct.product = [product];
            cartProduct.quantity = req.body.quantity || 1;
            cartProduct.user = user;
            // Add cart product to user
            await db.getRepository(Cart_Product).save(cartProduct);
            if (typeof user.cart === 'undefined') {
                user.cart = [];
            }
            user.cart.push(cartProduct);
            await db.getRepository(User).save(user);
            session.user = user;
            return res.redirect('/');
        } else {
            return res.render('pages/products', { error: "Username does not exist", User: session.user, quantity: quantity, sum: sum });
        }
    } else {
        return res.render('pages/products', { error: "Product does not exist", User: session.user, quantity: quantity, sum: sum });
    }
};