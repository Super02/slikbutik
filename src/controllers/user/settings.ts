import type { RequestHandler } from 'express';
import { User, Cart_Product, Order } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
    if (user) {
        if(req.body.change_pfp) {
            user.profile_img = req.body.profile_img;
            await db.getRepository(User).save(user);
            session.user = user;
            res.redirect('/settings');
        } else if(req.body.delete) {
            // Delete all cart products related to user
            const orders = await db.getRepository(Order).find({ where: { user: user }, relations: ["order"] });
            const items = await db.getRepository(Cart_Product).find({ where: { user: user } });
            items.forEach(async (item) => {
                await db.getRepository(Cart_Product).delete({ id: item.id });
            });
            orders.forEach(async (order) => {
                order.order.forEach(async (item) => {
                    await db.getRepository(Cart_Product).delete({ id: item.id });
                });
                await db.getRepository(Order).delete({ id: order.id });
            });
            await db.getRepository(User).delete({ id: user.id });
            session.user = null;
            res.redirect('/');
        }
    } else {
        res.render('pages/settings', { error: "Username does not exist" });
    }
};

export const get: RequestHandler = async (req, res) => {
    if (!session.user) {
        res.redirect('/login');
        return;
    }
    res.render('pages/settings');
};