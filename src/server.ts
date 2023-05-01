// We are going to use the MVC model to structure our application
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DATABASE_URL);
import express, { Express, Request, Response } from 'express';
import { User, Product, Cart_Product, Order } from "./models/user"
import { db } from './database';
import "reflect-metadata"
import * as argon2 from "argon2";
import router from './router';

var bodyParser = require('body-parser')
var session = require('express-session');
const app: Express = express();
const port = 3000;
var quantity = 0;
var sum = 0;
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
  })); 
app.use(express.static("src/public"));
app.set('views', 'src/views');
app.set('view engine', 'ejs');

router(app);

app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});


