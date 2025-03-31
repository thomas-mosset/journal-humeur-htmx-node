import express from 'express';
// import fetch from "node-fetch";
// import db from "./config/database.js";

// .env file
import dotenv from 'dotenv';
dotenv.config();

// Import Router
import routes from './routes/routes.js';

// create app
const app = express();
app.use(express.urlencoded({extended: false}));

// static assets
app.use(express.static('public'));

// Use routes
app.use('/', routes); 

// listen to port
app.listen(3000, () => {
    console.log('App listening on port 3000');
});