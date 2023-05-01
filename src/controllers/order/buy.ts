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
    const products = await db.getRepository(Product).find();
    const product = await db.getRepository(Product).findOne({ where: [{ id: parseInt(req.params.id) }] });
    if (typeof product !== 'undefined' && product !== null) {
        let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }], relations: ["cart"] });
        if (typeof user !== 'undefined' && user !== null) {
            // Check if product is already in cart
            let exist = await db.getRepository(Cart_Product).findOne({ where: [{ product: product, user: user }], relations: ["user"] });
            if (typeof exist !== 'undefined' && exist !== null) {
                // Update quantity
                quantity = exist.quantity+(parseInt(req.body.quantity) || 1);
                await db.getRepository(Cart_Product).update({ id: exist.id }, { quantity: quantity });
                return res.render('pages/products', { success: "Product added to cart", User: session.user, products: products });
            }
            // Create cart product
            const cartProduct = new Cart_Product();
            cartProduct.product = [product];
            cartProduct.quantity = (req.body.quantity || 1);
            cartProduct.user = user;
            // Add cart product to user
            await db.getRepository(Cart_Product).save(cartProduct);
            let cart = await db.getRepository(Cart_Product).find({ where: [{ user: user }], relations: ["product"] });
            if (typeof cart === 'undefined' || cart === null) {
                cart = [];
            }
            cart.push(cartProduct);
            user.cart = cart;
            await db.getRepository(User).save(user);
            session.user = user;
            session.sum = session.sum+product.price;
            session.quantity = session.quantity+quantity;
            return res.render('pages/products', { success: "Product added to cart", User: session.user, products: products });
        } else {
            return res.render('pages/products', { error: "Username does not exist", User: session.user, products: products });
        }
    } else {
        return res.render('pages/products', { error: "Product does not exist", User: session.user, products: products });
    }
};