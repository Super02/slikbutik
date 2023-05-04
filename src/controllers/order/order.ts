import type { RequestHandler } from 'express';
import { Order, User, cartProduct } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] }); // Get the user
    const cartProducts = await db.getRepository(cartProduct).find({ where: [{ user: session.user }] }); // Get all cartProducts
    if (user) {
        if(user.balance < session.sum) {
            return res.render('pages/index', { error: "Du har ikke nok penge til at købe dette!" });
        }
        user.balance -= session.sum;
        const newOrder = new Order();
        newOrder.user = user;
        newOrder.order = cartProducts;
        newOrder.total = session.sum;
        await db.getRepository(Order).save(newOrder);
        // Assign all cartProducts to be null
        for (let i = 0; i < cartProducts.length; i++) {
            cartProducts[i].user = null; // Remove the user constraint
            await db.getRepository(cartProduct).save(cartProducts[i]); // Save the cartProduct
        }
        res.redirect('/products');
    } else {
        res.render('pages/index', { error: "Unauthorized" });
    }
};