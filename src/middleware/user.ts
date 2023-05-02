import { RequestHandler } from 'express';
var session = require('express-session');


export const user: RequestHandler = async (req, res, next) => {
    if(!session.user && req.path !== '/login' && req.path !== '/register' && req.path !== '/logout' && req.path !== '/'){ // Require login for all pages except /login, /register, /logout and /
        return res.redirect('/login'); // Redirect to login page if not logged in and trying to access other pages
    }
    res.locals.session = session; // Make session available in all views
    next(); // Continue
};
  