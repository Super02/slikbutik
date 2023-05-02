import type { RequestHandler } from 'express';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    session.user = null;
    res.redirect('/');
};