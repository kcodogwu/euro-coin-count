'use strict';

// load modules
const http = require('http');
const dotenv = require('dotenv');
const express = require('express');
const methodOverride = require('method-override');
const httpProxy = require('express-http-proxy');
const session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const credential = require('credential');
const redisClient = require('redis').createClient({ host: '172.17.0.1', port: 6379 });
const jwt = require('jsonwebtoken');

// bring in environment settings
dotenv.config();

let token = null;
const app = express();
const { HOST, PORT, SECRET } = process.env;
const userManagementServiceProxy = httpProxy('http://172.17.0.1:9002');
const gameEngineServiceProxy = httpProxy('http://172.17.0.1:9003');
const leaderboardServiceProxy = httpProxy('http://172.17.0.1:9004');

const htmlString = (title, content) => `
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
  <link rel="stylesheet" href="/styles/main.css" />
</head>
<body>
  <div id="page">
    <div id="wrapper">
      <header><h1>Euro Coin Count</h1></header>
      <div id="content">
        ${ content }
      </div>
    </div>
  </div>
</body>
</html>
`;

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

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

app.use('/users', (req, res, next) => {
  userManagementServiceProxy(req, res, next);
});

app.use('/game', (req, res, next) => {
  gameEngineServiceProxy(req, res, next);
});

app.use('/leaderboard', (req, res, next) => {
  leaderboardServiceProxy(req, res, next);
});

// routes
passport.use(new LocalStrategy(
  (username, password, done) => {

    redisClient.hgetall('user:' + username, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      credential().verify(user.hash, password, (err, isValid) => {
        if (err) {
          return done(null, false);
        }

        if (!isValid) {
          return done(null, false);
        }

        token = jwt.sign({ payload: username }, 'creatures bits white next', { expiresIn: 86400 });

        return done(null, user);
      });
    });
  }
));

app.get('/', (req, res) => {
  const a = req.query.a;
  let extraClass = '';

  if (a === 'no') {
    extraClass = 'no-access-visible';
  }

  res
    .status(200)
    .send(htmlString('Log in', `
      <h2 class="center-text">Log in<h2>
      <div class="no-access ${ extraClass }">Log in attempt failed. Please supply a correct username and password</div>
      <form id="log-in-form" action="/post-log-in" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <button type="submit" id="log-in" name="logIn">Log in</button>
        <br />
        <span>Don't have an account? Then <a href="/users/sign-up">sign up</a>.</span>
      </form>
      <script src="/scripts/log-in.js"></script>
    `))
  ;
});

app.get('/log-in', (req, res) => {
  const a = req.query.a;
  let extraClass = '';

  if (a === 'no') {
    extraClass = 'no-access-visible';
  }
  
  res
    .status(200)
    .send(htmlString('Log in', `
      <h2 class="center-text">Log in<h2>
      <div class="no-access ${ extraClass }">Log in attempt failed. Please supply a correct username and password</div>
      <form id="log-in-form" action="/post-log-in" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <button type="submit" id="log-in" name="logIn">Log in</button>
        <br />
        <span>Don't have an account? Then <a href="/users/sign-up">sign up</a>.</span>
      </form>
      <script src="/scripts/log-in.js"></script>
    `))
  ;
});

app.get('/log-out', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post('/post-log-in',  passport.authenticate('local', { failureRedirect: '/?a=no' }), (req, res) => {
  redisClient.hgetall('user:' + req.body.username, (err, user) => {
    if (user) {
      res.redirect('/users/dashboard/' + req.body.username + '?id=' + token);
    }
  });
});

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  redisClient.hgetall('user:' + user, (err, reply) => {
    callback(err, reply);
  });
});

const startServer = () => {
  http.createServer(app).listen(app.get('port'), app.get('host'), (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(`Listening at http://${ app.get('host') } on port ${ app.get('port') } in ${ app.get('env') } mode; Press Ctrl+C to cancel.`);
  });
};

startServer();