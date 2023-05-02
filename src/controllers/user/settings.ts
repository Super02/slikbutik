import type { RequestHandler } from 'express';
import { User, cartProduct, Order } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
    if (user) {
        if(req.body.change_pfp) { // Change profile picture
            user.profile_img = req.body.profile_img;
            await db.getRepository(User).save(user);
            session.user = user;
            res.redirect('/settings');
        } else if(req.body.delete) { // Delete account
            // Delete all cart products related to user
            const orders = await db.getRepository(Order).find({ where: { user: user }, relations: ["order"] }); // Get all orders
            const items = await db.getRepository(cartProduct).find({ where: { user: user } }); // Get all cartProducts
            items.forEach(async (item) => {
                await db.getRepository(cartProduct).delete({ id: item.id }); // Delete all cartProducts related to user
            });
            orders.forEach(async (order) => {
                order.order.forEach(async (item) => {
                    await db.getRepository(cartProduct).delete({ id: item.id }); // Delete all cartProducts related to order
                });
                await db.getRepository(Order).delete({ id: order.id }); // Delete all orders related to user
            });
            await db.getRepository(User).delete({ id: user.id }); // Delete user
            session.user = null;
            res.redirect('/');
        }
    } else {
        res.render('pages/settings', { error: "Username does not exist" });
    }
};

export const get: RequestHandler = async (req, res) => {
    res.render('pages/settings'); // Render settings page
};