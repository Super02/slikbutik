import type { Application } from 'express';

export default (app: Application) => {
    // Index route
    app.get('/', require('./controllers/index').get);

    // Authentication routes
    app.get('/login', require('./controllers/auth/login').get);
    app.post('/login', require('./controllers/auth/login').post);
    app.get('/register', require('./controllers/auth/register').get);
    app.post('/register', require('./controllers/auth/register').post);
    app.get('/logout', require('./controllers/auth/logout').get);

    // Order routes
    app.get('/products', require('./controllers/order/products').get);
    app.get('/buy/:id', require('./controllers/order/buy').get);
    app.get('/cart', require('./controllers/order/cart').get);
    app.get('/clearcart', require('./controllers/order/clearcart').get);
    app.get('/order', require('./controllers/order/order').get);
    app.get('/deleteall', require('./controllers/order/deleteall').get);

    // Admin routes
    app.get('/admin', require('./controllers/admin/admin').get);
    app.get('/setlevel/:id', require('./controllers/admin/setlevel').get);
    app.get('/showorder/:id', require('./controllers/admin/showorder').get);

    // User
    app.get('/settings', require('./controllers/user/settings').get);
    app.post('/settings', require('./controllers/user/settings').post);

    // 404
    app.use((req, res, next) => {
        return res.status(404).render('404');
    });
}