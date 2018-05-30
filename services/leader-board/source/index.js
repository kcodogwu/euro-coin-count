'use strict';

// load modules
const http = require('http');
const dotenv = require('dotenv');
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const redisClient = require('redis').createClient({ host: '172.17.0.1', port: 6379 });
const jwt = require('jsonwebtoken');

// bring in environment settings
dotenv.config();

let token = null;
const app = express();
const { HOST, PORT, SECRET } = process.env;

const htmlString = (title, content, l) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="author" content="Kingson Chinedu Odogwu" />
  <meta name="description" content="Euro Coin Count is an application, to show case the microservice application pattern. Given an euro amount, a user will guess the minimum number of euro coins needed to make up that amount." />
  <meta name="keyword" content="euro, coin, count, app, game" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
  <title>Euro Coin Count${ title }</title>
  <link rel="stylesheet" href="/leaderboard/styles/main.css" />
</head>
<body>
  <div id="mySidenav" class="sidenav">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
    <a href="/log-out">Log out</a>
    <a href="/users/dashboard/${ l && l.username }?id=${ l && l.token }">My profile</a>
    <a href="/game/play/${ l && l.username }?id=${ l && l.token }">Play</a>
    <a href="/game/instructions/${ l && l.username }?id=${ l && l.token }">Instructions</a>
    <a href="/game/difficulty-level/${ l && l.username }?id=${ l && l.token }">Difficulty</a>
    <a href="/leaderboard/index/${ l && l.username }?id=${ l && l.token }">Leaderboard</a>
  </div>
  <div id="page">
    <div id="wrapper">
      <header>
        <h1>Euro Coin Count</h1>
        <div onclick="openNav()">MENU</div>
      </header>
      <div id="content">
        ${ content }
      </div>
    </div>
  </div>
  <script src="/leaderboard/scripts/menu.js"></script>
</body>
</html>
`;

const validateToken = (req, res, next) => {
  token = token === null ? (req.body && req.body.id) || (req.params && req.params.id) || (req.query && req.query.id) || req.headers['x-access-id'] : token;

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'creatures bits white next', (err, decoded) => {      
      if (err) {
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>Sorry</title></head>
          <body>
            <h2>Something went wrong.</h2>
            <a href="/">Return to login page</a>
          </body>
          </html>
        `);   
      }
      
      if (decoded) {
        // if everything is good, save to request for use in other routes
        req.session.username = (req.body && req.body.username) || (req.params && req.params.username) || (req.query && req.query.username);
        req.session.token = token;
        req.decoded = decoded;    
        next();
      } else {
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>Sorry</title></head>
          <body>
            <h2>Something went wrong.</h2>
            <a href="/">Return to login page</a>
          </body>
          </html>
        `);
      }
    });
  } else {
    return res.status(403).end('No token provided.');
  }
};

redisClient.on('connect', () => console.log('Connected to the database'));
redisClient.on('error', err => console.log('ERROR: ' + err));
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

// routes
app.get('/index/:username', validateToken, (req, res) => {
  res
    .status(200)
    .send(htmlString('Leaderboard', `
      <h2 class="center-text">Leaderboard</h2>
      <div class="leaderboard">
        <div class="rankrow">
          <div class="rankitem">Rank</div>
          <div class="rankitem">User</div>
          <div class="rankitem">Score</div>
        </div>
      </div>
      <script src="/leaderboard/scripts/leaderboard.js"></script>
    `, req.session))
  ;
});

app.get('/data', (req, res) => {
  let result = [];

  const returnJSON = (item) => {
    if (item.length === result.length) {
      res.json(result);
    }
  };

  redisClient.keys('user*', (err, reply) => {
    if (err) {
      return;
    }

    reply.map(key => {
      redisClient.hget(key, 'score', (errr, rep) => {
        if (err) {
          return;
        }
        
        result = result.concat({ user: key.replace('user:', ''), score: Number(rep) });
        returnJSON(reply);
      });
    });
  });
});

const startServer = () => {
  http.createServer(app).listen(app.get('port'), app.get('host'), (err) => {
    if (err) {
      return;
    }

    console.log(`Listening at http://${ app.get('host') } on port ${ app.get('port') } in ${ app.get('env') } mode; Press Ctrl+C to cancel.`);
  });
};

startServer();