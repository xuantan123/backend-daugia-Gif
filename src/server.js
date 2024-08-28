import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from './route/web.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 10000;

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
});
