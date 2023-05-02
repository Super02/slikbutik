import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: session.user.username }] });
    if (user) {
        user.permission = parseInt(req.params.level);
        await db.getRepository(User).save(user);
        session.user = user;
        res.redirect('/products');
    } else {
        res.render('pages/settings', { error: "Username does not exist" });
    }
};