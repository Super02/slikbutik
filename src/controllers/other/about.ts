import type { RequestHandler } from 'express';

export const get: RequestHandler = async (req, res) => {
    res.render('pages/about'); // Render the about page
};