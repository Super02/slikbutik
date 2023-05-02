import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: session.user.username }] }); // Get the user from the database
    if (user) { // Check if user exists
        user.permission = parseInt(req.params.level); // Set the permission level to the level specified in the URL (For demo purposes)
        await db.getRepository(User).save(user); // Save the user
        session.user = user; // Set the session user so we can use it in other controllers
        res.redirect('/products'); // Redirect to products page
    } else {
        res.render('pages/settings', { error: "Bruger eksisterer ikke" });
    }
};