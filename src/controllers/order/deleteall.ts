import type { RequestHandler } from 'express';
import { Cart_Product } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    await db.getRepository(Cart_Product).delete({});
    session.quantity = 0;
    session.sum = 0;
};