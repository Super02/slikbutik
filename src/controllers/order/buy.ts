import type { RequestHandler } from 'express';
import { cartProduct, User, Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    const products = await db.getRepository(Product).find(); // Get all products
    const product = await db.getRepository(Product).findOne({ where: [{ id: parseInt(req.params.id) }] }); // Get the product
    if (typeof product !== 'undefined' && product !== null) { // Check if product exists
        let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] }); // Get the user
        if (typeof user !== 'undefined' && user !== null) { // Check if user exists
            // Check if product is already in cart
            let exist = await db.getRepository(cartProduct).findOne({ where: [{ product: product, user: user }], relations: ["user"] });
            if (typeof exist !== 'undefined' && exist !== null) { // If the product is already in the cart we don't have to create a new cart product. We just update the quantity
                // Update quantity
                session.quantity += parseInt(req.body.quantity) || 1; 
                session.sum += product.price * (parseInt(req.body.quantity) || 1); 
                await db.getRepository(cartProduct).update({ id: exist.id }, { quantity: exist.quantity + (parseInt(req.body.quantity) || 1) }); 
                return res.render('pages/products', { success: "Product added to cart", products: products }); 
            }
            // Create cart product
            const cart_Product = new cartProduct(); // Create new cart product
            cart_Product.product = [product];  // Set product
            cart_Product.quantity = (req.body.quantity || 1);  // Set quantity
            cart_Product.user = user; // Set user relation
            await db.getRepository(cartProduct).save(cart_Product); // Save cart product
            session.sum += product.price * (parseInt(req.body.quantity) || 1); // Set a session variable for the total price
            session.quantity += parseInt(req.body.quantity) || 1; // Set a session variable for the total quantity
            return res.render('pages/products', { success: "Product added to cart", products: products });
        } else {
            return res.render('pages/products', { error: "Username does not exist", products: products });
        }
    } else {
        return res.render('pages/products', { error: "Product does not exist", products: products });
    }
};