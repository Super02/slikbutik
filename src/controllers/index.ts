import type { RequestHandler } from 'express';
import * as argon2 from "argon2";
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    res.render('pages/index', { User: session.user, quantity: quantity, sum: sum });
};