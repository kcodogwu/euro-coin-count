'use strict';
import { redisClient } from './app-db-access';
import credential from 'credential';
import jwt from 'jsonwebtoken';

let token = null;

const appRouter = (app) => {
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
      <link rel="stylesheet" href="/users/styles/main.css" />
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
      <script src="/users/scripts/menu.js"></script>
    </body>
    </html>
  `;

  const signUp = (req, res) => {
    res
      .status(200)
      .send(htmlString('Sign up', `
        <h2 class="center-text">Sign up</h2>
        <form id="sign-up-form" action="/users/post-sign-up" method="POST">
          <label for="full-name">Full name:</label>
          <input type="text" id="full-name" name="fullName" required />
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <button type="submit" id="sign-up">Sign up</button>
          <br />
        </form>
      `, req.session))
    ;
  };

  const dashboard = (req, res) => {
    const username = req.params.username;

    redisClient.hgetall('user:' + username, (err, user) => {
      if (err) {
        return;
      }

      req.session.fullName = user.fullName;
      req.session.username = username;
      req.session.difficultyLevel = user.difficultyLevel;
      req.session.score = user.score;

      res
        .status(200)
        .send(htmlString('Dashboard', `
          <h2 class="center-text">${ user.fullName}</h2>
          <h3 class="center-text">@${ username }</h3>
          <p>Difficulty level: ${ user.difficultyLevel }</p>
          <p>Current score: ${ user.score }</p>
        `, req.session))
      ;
    });
  };

  const postLogOut = (req, res) => {
    req.logout();
    res.redirect('/');
  };

  const postSignUp = (req, res) => {
    const body = JSON.parse(Object.keys(req.body)[0]);
    const fullName = body.fullName;
    const username = body.username;
    const password = body.password;
    
    credential().hash(password, (err, hash) => {
      if (err) { return; }

      redisClient.hmset(
        'user:' + username, 
        'fullName', fullName, 
        'hash', hash,
        'difficultyLevel', 'Easy',
        'score', 0
      );

      let token = jwt.sign({ payload: username }, 'creatures bits white next', { expiresIn: 86400 });

      res.redirect('/users/dashboard/' + username + '?id=' + token);
    });
  };

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

  // GET
  app.get('/sign-up', signUp);
  app.get('/dashboard/:username', validateToken, dashboard);
  //POST
  app.post('/post-sign-up', postSignUp);
};

export { appRouter };