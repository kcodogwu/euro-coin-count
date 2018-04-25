'use strict';

import * as gameFunctions from './game-functions';
import { redisClient } from './app-db-access';
import jwt from 'jsonwebtoken';

let token = null;

const appRouter = app => {
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
    <link rel="stylesheet" href="/game/styles/main.css" />
  </head>
  <body>
    <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#">Log out</a>
      <a href="/users/dashboard/${ l && l.username }?id=${ l && l.token }">My profile</a>
      <a href="/game/play/${ l && l.username }?id=${ l && l.token }">Play</a>
      <a href="/game/instructions/${ l && l.username }?id=${ l && l.token }">Instructions</a>
      <a href="/game/difficulty-level/${ l && l.username }?id=${ l && l.token }">Difficulty</a>
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
    <script src="/game/scripts/menu.js"></script>
  </body>
  </html>
  `;

  const difficultyLevel = (req, res) => {
    res
      .status(200)
      .send(htmlString('Difficulty Level', `
        <h2 class="center-text">Select difficulty level<h2>
        <form id="coin-count-form" action="#">
          <button type="submit" name="easy">Easy</button>
          <button type="submit" name="normal">Normal</button>
          <button type="submit" name="hard">Hard</button>
        </form>
      `, req.session))
    ;
  };

  const game = (req, res) => {
    res
      .status(200)
      .send(htmlString('Play the game', `
        <form id="coin-count-form" action="/game/post-play">
          <label>What's the breakdown for:</label>
          <div class="euro-amount center-text">${ gameFunctions.formatEuroAmount(gameFunctions.generateEuroAmount({ difficultyLevel: 'easy', firstTry: false })) }</div>
          <div id="result">
            <div class="result-child">
              <span class="">
                <input type="number" class="" name="coinCount1" required />
                x
                <select name="coinLabel1">
                  <option value="€2">€2</option>
                  <option value="€1">€1</option>
                  <option value="50c">50c</option>
                  <option value="20c">20c</option>
                  <option value="10c">10c</option>
                  <option value="5c">5c</option>
                  <option value="2c">2c</option>
                  <option value="1c">1c</option>
                </select>
              </span>
            </div>
          </div>
          <button class="add">+</button>
          <input value="Submit answer" name="submitButton" type="submit" />
        </form>
        <script src="/game/scripts/game.js"></script>
      `, req.session))
    ;
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

  const postPlay = (req, res) => {
    let userAnswer = [];
    let x = 1;

    while (true) {
      userAnswer.push({ coin: req.body['coinLabel' + x], count: Number(req.body['coinCount' + x]) });
      ++x;

      if (req.body['coinLabel' + x] === null || req.body['coinCount' + x]) {
        userAnswer = gameFunctions.sortAnswer(userAnswer);
        
        redisClient.hgetall('user:' + req.session.username, (err, user) => {
          if (err) {
            return;
          }

          if (user) {
            redisClient.hmset(
              'user:' + req.session.username, 
              'fullName', user.fullName, 
              'hash', user.hash,
              'difficultyLevel', user.difficultyLevel,
              'score', gameFunctions.givePoints(user, gameFunctions.checkAnswer(user, userAnswer, 10)) 
            );
          }
        });
        break;
      }
    }

  };
  
  // GET
  app.get('/difficulty-level/:username', difficultyLevel);
  app.get('/game/difficulty-level/:username', validateToken, difficultyLevel);
  app.get('/game/play/:username', validateToken, game);
  app.get('/play/:username', validateToken, game);
  app.get('/game/instruction/:username', validateToken, game);
  app.get('/play/:username', validateToken, game);
  // POST
  app.post('/post-play/');
  //app.get('/users/dashboard/:username', validateToken, dashboard);
};

export { appRouter };