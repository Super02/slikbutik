import type { RequestHandler } from 'express';
import { Cart_Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');
let quantity = 0;
let sum = 0;

export const get: RequestHandler = async (req, res) => {
    await db.getRepository(Cart_Product).delete({});
};