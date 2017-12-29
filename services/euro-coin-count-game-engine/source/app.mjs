'use strict';

// load modules
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';

// bring in environment settings
dotenv.config();

const app = express();
const { HOST = 'localhost', PORT = 3000 } = process.env;
let server;

app.disable('x-powered-by');
app.set('host', HOST);
app.set('port', PORT);
server = http.createServer(app);

export { app, server };