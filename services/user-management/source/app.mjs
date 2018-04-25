'use strict';

// load modules
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import * as routes from '../source/app-routes';

// bring in environment settings
dotenv.config();

const app = express();
const { HOST, PORT, SECRET } = process.env;
let server;

app.disable('x-powered-by');
app.set('host', HOST);
app.set('port', PORT);
app.use(helmet());
app.use(express.static(path.resolve('./source/assets')));

app.use(session({ 
  secret: SECRET,
  resave: false,
  saveUninitialized: true, 
}));

app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());
routes.appRouter(app);
server = http.createServer(app);

export { app, server };