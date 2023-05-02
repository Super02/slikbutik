import type { RequestHandler } from 'express';

export const get: RequestHandler = async (req, res) => {
    res.render('pages/index'); // Render the index page
};