import type { RequestHandler } from 'express';
import { User, Product, Order, cartProduct } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');


export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: session.user.username }] }); 
    if (user.permission > 0) { // Check if the user is an admin
        if(req.body.user_id !== undefined) { // Check if the delete user button was pressed
            // Delete all cartProducts with the order id
            const user = await db.getRepository(User).findOne({ where: [{ id: parseInt(req.body.user_id) }] }); // Get the user
            const orders = await db.getRepository(Order).find({ where: { user: user }, relations: ["order"] }); // Get all orders
            const items = await db.getRepository(cartProduct).find({ where: { user: user } }); // Get all items in cart
            items.forEach(async (item) => {
                await db.getRepository(cartProduct).delete({ id: item.id }); // Delete all items in cart (We have to delete this first due to relations)
            });
            orders.forEach(async (order) => {
                order.order.forEach(async (item) => {
                    await db.getRepository(cartProduct).delete({ id: item.id }); // Delete all cartProducts with the order id
                }); 
                await db.getRepository(Order).delete({ id: order.id }); // Delete all orders with the user id
            });
            await db.getRepository(User).delete({ id: user.id }); // Delete the user
            if(session.user.id === user.id) { // Check if the user is deleting themselves
                session.user = null; // If the user is deleting themselves, log them out
            }
            return res.redirect('/');
        } else if(req.body.price !== undefined) { // Check if the create new product button was pressed
            const newProduct = new Product(); // Create a new product
            newProduct.name = req.body.name; // Set the product name
            newProduct.img = req.body.image_url; // Set the product image
            newProduct.description = req.body.description; // Set the product description
            newProduct.price = req.body.price; // Set the product price
            await db.getRepository(Product).save(newProduct); // Save the product in the database
            res.redirect('/products');
        } else if(req.body.delete_product !== undefined) { // Check if the delete product button was pressed
            const product = await db.getRepository(Product).findOne({ where: { id: parseInt(req.body.delete_product) } }); // Get the product
            await db.getRepository(Product).delete({ id: product.id }); // Delete the product
            res.redirect('/products'); // Redirect to the products page
        } else {
            res.render('pages/index', { error: "Unknown action" });
        }
    } else {
        res.redirect('/');
    }
};

export const get: RequestHandler = async (req, res) => {
    if(session.user.permission < 1){
        res.redirect('/products');
        return;
    }
    const orders = await db.getRepository(Order).find({relations: ["user", "order"]}); // Get all orders
    const users = await db.getRepository(User).find(); // Get all users
    const products = await db.getRepository(Product).find(); // Get all products
    res.render('pages/admin', { orders: orders, users: users, products: products }); // Render the admin page with the orders, users and products as parameters
};