// We are going to use the MVC model to structure our application
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import "reflect-metadata"
import router from './router';
import { user } from './middleware/user';

var bodyParser = require('body-parser')
const app: Express = express();
const port = 3000;
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
  })); 

app.use(express.static("src/public"));
app.set('views', 'src/views');
app.set('view engine', 'ejs');

// Middleware
app.use(user);

router(app); // Register all routes

app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});


