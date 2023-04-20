// We are going to use the MVC model to structure our application


import express, { Express, Request, Response } from 'express';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import "reflect-metadata"
import * as argon2 from "argon2";

var bodyParser = require('body-parser')
var session = require('express-session');
const connectionManager = require('typeorm').getConnectionManager();
const app: Express = express();
const port = 3000;
var profile_img = "https://cdn.onlinewebfonts.com/svg/img_264570.png";
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
  })); 
app.use(express.static("src/public"));
app.set('views', 'src/views');
app.set('view engine', 'ejs');


app.get('/', (req: Request, res: Response) => {
    res.render('pages/index', { profile_img: profile_img });
});

app.post('/login', (req: Request, res: Response) => {
    connectionManager.get("default").query("SELECT * FROM users WHERE username = $1", [req.body.username]).then((result) => {
        // Check password
        if (result.length > 0) {
            argon2.verify(result[0].password, req.body.password).then((match) => {
                if (match) {
                    session.user = result[0];
                    res.render('pages/products', { User: User });
                } else {
                    res.render('pages/login', { error: "Invalid credentials", profile_img: profile_img});
                }
            });
        }
    });
});

app.post('/register', async (req: Request, res: Response) => {
    // Get password
    let password = req.body.password;
    // Hash password
    const hashedPassword = await argon2.hash(password);
    // Create user
    let user = new User();
    user.username = req.body.username;
    user.password = hashedPassword;

    // Save user
    connectionManager.get("default").manager.save(user).then((user) => {
        res.render('pages/login', { profile_img: profile_img });
    }).catch((error) => {
        res.render('pages/register', { error: "Username already exists", profile_img: profile_img });
    });
    res.render('pages/register', { profile_img: profile_img });
});

app.get('/login', (req: Request, res: Response) => {
    res.render('pages/login', { profile_img: profile_img });
});

app.get('/register', (req: Request, res: Response) => {
    res.render('pages/register', { profile_img: profile_img });
});

app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});


