// We are going to use the MVC model to structure our application
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DATABASE_URL);
import express, { Express, Request, Response } from 'express';
import { User } from "./models/user"
import { db } from './database';
import "reflect-metadata"
import * as argon2 from "argon2";

var bodyParser = require('body-parser')
var session = require('express-session');
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

app.post('/login', async (req: Request, res: Response) => {
    const user = await db.getRepository(User).findOne({ where: [{username: req.body.username }] });
    if (user) {
        if (await argon2.verify(user.password, req.body.password)) {
            session.user = user;
            res.redirect('/profile');
        } else {
            res.render('pages/login', { error: "Incorrect password", profile_img: profile_img });
        }
    } else {
        res.render('pages/login', { error: "Username does not exist", profile_img: profile_img });
    }
});

app.post('/register', async (req: Request, res: Response) => {
    return 200;
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


