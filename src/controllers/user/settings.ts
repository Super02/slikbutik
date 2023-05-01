import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const post: RequestHandler = async (req, res) => {
    if (!session.user) {
        res.redirect('/login');
        return;
    }
    let user = await db.getRepository(User).findOne({ where: [{ id: session.user.id }] });
    if (user) {
        user.profile_img = req.body.profile_img;
        await db.getRepository(User).save(user);
        session.user = user;
        res.redirect('/products');
    } else {
        res.render('pages/settings', { error: "Username does not exist", User: session.user, quantity: quantity, sum: sum });
    }
};

export const get: RequestHandler = async (req, res) => {
    if (!session.user) {
        res.redirect('/login');
        return;
    }
    res.render('pages/settings', { User: session.user, quantity: quantity, sum: sum });
};