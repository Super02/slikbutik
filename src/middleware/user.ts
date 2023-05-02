import { RequestHandler } from 'express';
var session = require('express-session');


export const user: RequestHandler = async (req, res, next) => {
    if(!session.user && req.path !== '/login' && req.path !== '/register' && req.path !== '/logout' && req.path !== '/'){
        return res.redirect('/login');
    }
    res.locals.session = session;
    next();
};
  