'use strict';

// load modules
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import domain from 'domain';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as routes from '../source/app-routes';

// bring in environment settings
dotenv.config();

const app = express();
const { HOST = 'localhost', PORT = 3000 } = process.env;
let server;

app.disable('x-powered-by');
app.set('host', HOST);
app.set('port', PORT);

app.use((req, res, next) => {
  const dom = domain.create();

  dom.on('error', (err) => {
    console.log('DOMAIN ERROR CAUGHT\n', err.stack);
    
    try {
      setTimeout(() => {
        console.error('Failsafe shutdown');
        process.exit(1);
      }, 5000);
  
      server.close();

      try {
        next(err);
      } catch (ex) {
        console.error('Express error mechanism failed\n', ex.stack);
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Server error');
      }
    } catch (error) {
      console.error('Unable to send 500 response\n', error.stack);
    }
  });

  dom.add(req);
  dom.add(res);
  dom.run(next);
});

app.use(helmet());
app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

routes.appRouter(app);

server = http.createServer(app);

export { app, server };