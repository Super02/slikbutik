import type { RequestHandler } from 'express';
import { cartProduct, User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
export const get: RequestHandler = async (req, res) => {
    const user = await db.getRepository(User).findOne({ where: {id: session.user.id } });
    // Find all products in cart without getting RangeError: Maximum call stack size exceeded

    const items = await db.getRepository(cartProduct).find({ where: [{ user: user }], relations: ["product"] });
    // Get total quantity for user
    let quantity = 0;
    let sum = 0;
    items.forEach((item) => { // Get amount of items in cart
        quantity += item.quantity; 
    });
    items.forEach((item) => {
        if(item.product === null) {
            return;
        }
        sum += item.quantity * item.product[0].price; // Get total price of items in cart
    });
    session.quantity = quantity; // Set session variables
    session.sum = sum; // Set session variables
    return res.render('pages/cart', { items: items }); // Render cart
};