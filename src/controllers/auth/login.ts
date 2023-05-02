import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
import * as argon2 from "argon2"; // Import argon2 for verifying passwords
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    res.render('pages/login');
};

export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: req.body.username }] }); // Check if user exists
    if (user) {
        if (await argon2.verify(user.password, req.body.password)) { // Verify the password. If it's correct, redirect to products page.
            session.user = user; // Set the session user so we can use it in other controllers
            res.redirect('/products'); // Redirect to products page
        } else {
            res.render('pages/login', { error: "Incorrect password" });
        }
    } else {
        res.render('pages/login', { error: "Username does not exist" });
    }
};