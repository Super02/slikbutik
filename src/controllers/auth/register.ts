import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
import * as argon2 from "argon2"; // Import argon2 for hashing passwords
var session = require('express-session');

export const post: RequestHandler = async (req, res) => {
    let user = await db.getRepository(User).findOne({ where: [{username: req.body.username }] }); // Check if username already exists
    if (user) {
        res.render('pages/register', { error: "Brugernavn allerede taget" });
    } else {
        const hashedPassword = await argon2.hash(req.body.password); // Hash password with argon2 and save it in the database
        const newUser = new User(); // Create new user
        newUser.username = req.body.username; // Set username
        newUser.password = hashedPassword; // Set the password to the hashed password, so we don't save the password in plain text (Security concern)
        await db.getRepository(User).save(newUser); // Save the user
        session.user = newUser; // Set the session user so we can use it in other controllers
        res.redirect('/products'); // Redirect to products page
    }
};

export const get: RequestHandler = async (req, res) => {
    res.render('pages/register'); // Render the register page
};