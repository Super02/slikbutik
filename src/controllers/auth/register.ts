import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
import * as argon2 from "argon2";
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: req.body.username }] });
    if (user) {
        res.render('pages/register', { error: "Username already exists" , User: session.user, quantity: quantity, sum: sum});
    } else {
        const hashedPassword = await argon2.hash(req.body.password);
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.password = hashedPassword;
        await db.getRepository(User).save(newUser);
        session.user = newUser;
        res.redirect('/products');
    }
};

export const get: RequestHandler = async (req, res) => {
    res.render('pages/register', { User: session.user, quantity: quantity, sum: sum });
};