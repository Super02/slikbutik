import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
import * as argon2 from "argon2";
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    res.render('pages/login', { User: session.user, quantity: quantity, sum: sum });
};

export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: req.body.username }] });
    if (user) {
        if (await argon2.verify(user.password, req.body.password)) {
            session.user = user;
            res.redirect('/products');
        } else {
            res.render('pages/login', { error: "Incorrect password" , User: session.user, quantity: quantity, sum: sum});
        }
    } else {
        res.render('pages/login', { error: "Username does not exist" , User: session.user, quantity: quantity, sum: sum});
    }
};