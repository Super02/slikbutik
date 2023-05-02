import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';
var session = require('express-session');

export const get: RequestHandler = async (req, res) => {
    const user = await db.getRepository(User).findOne({ where: {id: session.user.id } });
    if(user) {
        await db.getRepository(User).update({ id: user.id }, { balance: user.balance + parseInt(req.params.money) }); // Update user balance with 1000 new kr
    }
    session.user.balance = user.balance + parseInt(req.params.money);
    res.render('pages/index', {'success': req.params.money + ' kr er blevet tilføjet til din bruger'});
};
