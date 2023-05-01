import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    if(!session.user){
        res.redirect('/login');
        return;
    }
    let user = await db.getRepository(User).findOne({ where: [{username: session.user.username }] });
    if (user) {
        user.permission = parseInt(res.locals.admin.level);
        await db.getRepository(User).save(user);
        session.user = user;
        res.redirect('/products');
    } else {
        res.render('pages/settings', { error: "Username does not exist" , User: session.user, quantity: quantity, sum: sum});
    }
};