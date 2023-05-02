import type { RequestHandler } from 'express';
import { Cart_Product, User, Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    const products = await db.getRepository(Product).find();
    const product = await db.getRepository(Product).findOne({ where: [{ id: parseInt(req.params.id) }] });
    if (typeof product !== 'undefined' && product !== null) {
        let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
        if (typeof user !== 'undefined' && user !== null) {
            // Check if product is already in cart
            let exist = await db.getRepository(Cart_Product).findOne({ where: [{ product: product, user: user }], relations: ["user"] });
            if (typeof exist !== 'undefined' && exist !== null) {
                // Update quantity
                session.quantity += parseInt(req.body.quantity) || 1;
                session.sum += product.price * (parseInt(req.body.quantity) || 1);
                await db.getRepository(Cart_Product).update({ id: exist.id }, { quantity: exist.quantity + (parseInt(req.body.quantity) || 1) });
                return res.render('pages/products', { success: "Product added to cart", products: products });
            }
            // Create cart product
            const cartProduct = new Cart_Product();
            cartProduct.product = [product];
            cartProduct.quantity = (req.body.quantity || 1);
            cartProduct.user = user;
            await db.getRepository(Cart_Product).save(cartProduct);
            session.sum += product.price * (parseInt(req.body.quantity) || 1);
            session.quantity += parseInt(req.body.quantity) || 1;
            return res.render('pages/products', { success: "Product added to cart", products: products });
        } else {
            return res.render('pages/products', { error: "Username does not exist", products: products });
        }
    } else {
        return res.render('pages/products', { error: "Product does not exist", products: products });
    }
};