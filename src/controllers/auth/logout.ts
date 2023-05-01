import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
import * as argon2 from "argon2";
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    session.user = null;
    res.redirect('/');
};