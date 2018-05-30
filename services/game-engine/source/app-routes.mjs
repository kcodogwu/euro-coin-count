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
    <script src="/game/scripts/menu.js"></script>
  </body>
  </html>
  `;

  const instructions = (req, res) => {
    res
      .status(200)
      .send(htmlString('Instructions', `
        <h2 class="center-text">How to play Euro Coin Count</h2>
        <p>
          Euro Coin Count is a game that gives an euro amount, and a player will guess the 
          the minimum number of euro coins needed to make that amount.

          The app accounts for only the common €2, €1, 50c, 20c, 10c, 5c, 2c and 1c coins.
        </p>
        <p>
          The euro amount appears at the top of the page. Then the player selects an euro coin 
          denomination from the select box below the amount and also enters a number in the 
          text field next to the select box, indicating the how many multiples of that 
          denomination is makes up part the euro amount.
        </p>
        <p>
          The player can click the add button to add a new row for an extra euro denomination entry
          and the subtract button to remove a row.
        </p>
        <h3>Illustration</h3>
        <p>
          Below are sample inputs and an idea of what the output should be:

          123p = €1 x 1, 20c x 1, 2c x 1, 1c x 1.
          €12.34 = €2 x 6, 20c x 1, 10c x 1, 2c x 2.    
        </p>
      `, req.session))
    ;
  };

  const difficultyLevel = (req, res) => {
    res
      .status(200)
      .send(htmlString('Difficulty Level', `
        <h2 class="center-text">Select difficulty level<h2>
        <form id="coin-count-form-1" action="/game/post-difficulty-level" METHOD="POST">
          <button id="easy" type="submit" name="difficultyLevel" value="Easy">Easy</button>
          <input type="hidden" name="username" value="${ req.session.username }" />
          <input type="hidden" name="id" value="${ req.session.token }" />
        </form>
        <form id="coin-count-form-2" action="/game/post-difficulty-level" METHOD="POST">
          <button id="normal" type="submit" name="difficultyLevel" value="Normal">Normal</button>
          <input type="hidden" name="username" value="${ req.session.username }" />
          <input type="hidden" name="id" value="${ req.session.token }" />
        </form>
        <form id="coin-count-form-3" action="/game/post-difficulty-level" METHOD="POST">
          <button id="hard" type="submit" name="difficultyLevel" value="Hard">Hard</button>
          <input type="hidden" name="username" value="${ req.session.username }" />
          <input type="hidden" name="id" value="${ req.session.token }" />
        </form>
      `, req.session))
    ;
  };

  const game = (req, res) => {
    const euroAmount = gameFunctions.formatEuroAmount(gameFunctions.generateEuroAmount({ difficultyLevel: req.session.difficultyLevel }));
    req.session.euroAmount = euroAmount;

    res
      .status(200)
      .send(htmlString('Play the game', `
        <form id="coin-count-form" action="/game/post-play" METHOD="POST">
          <label>What's the breakdown for:</label>
          <div class="euro-amount center-text">${ euroAmount }</div>
          <div style="text-align: right">Score: ${ req.session.score }</div>
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
          <input type="hidden" name="id" value="${ req.session.token }" />
          <input type="hidden" name="username" value="${ req.session.username }" />
          <input type="hidden" name="euroAmount" value="${ euroAmount }" />
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
          
          redisClient.hgetall('user:' + req.session.username, (err, user) => {
            if (err) {
              next();
            }
      
            if (!user) {
              next();
            }

            req.session.difficultyLevel = user.difficultyLevel;
            req.session.score = user.score;
            next();
          });
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
    const body = JSON.parse(Object.keys(req.body)[0]);

    while (true) {
      userAnswer.push({ coin: body['coinLabel' + x], count: Number(body['coinCount' + x]) });
      ++x;

      if (!(body['coinLabel' + x])&& !(body['coinCount' + x])) {
        userAnswer = gameFunctions.sortAnswer(userAnswer);
        
        redisClient.hgetall('user:' + body.username, (err, user) => {
          if (err) {
            return;
          }

          let score = gameFunctions.givePoints(user, gameFunctions.checkAnswer(user, userAnswer, body.euroAmount));
   
          if (user) {
            redisClient.hmset(
              'user:' + body.username, 
              'fullName', user.fullName, 
              'hash', user.hash,
              'difficultyLevel', user.difficultyLevel,
              'score', score
            );
          }
        });

        res.redirect(`/game/play/${ body.username }?id=${ body.id }`);
        break;
      }
    }
  };

  const postDifficultyLevel = (req, res) => {
    const body = JSON.parse(Object.keys(req.body)[0]);

    redisClient.hgetall('user:' + body.username, (err, user) => {
      if (err) {
        return;
      }

      if (user) {
        redisClient.hmset(
          'user:' + body.username, 
          'fullName', user.fullName, 
          'hash', user.hash,
          'difficultyLevel', body.difficultyLevel,
          'score', user.score
        );
      }

      res.redirect(`/users/dashboard/${ body.username }?id=${ body.id }`);
    });
  };
  
  // GET
  app.get('/difficulty-level/:username', validateToken, difficultyLevel);
  app.get('/play/:username', validateToken, game);
  app.get('/instructions/:username', validateToken, instructions);
  // POST
  app.post('/post-play', postPlay);
  app.post('/post-difficulty-level', postDifficultyLevel);
};

export { appRouter };