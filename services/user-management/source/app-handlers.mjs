'use strict';

import { redisClient } from './app-db-access';
import credential from 'credential';

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

const logIn = (req, res) => {
  res
    .status(200)
    .send(htmlString('Log in', `
      <h2 class="center-text">Log in<h2>
      <form id="log-in-form" action="/post-log-in" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <button type="submit" id="log-in" name="logIn">Log in</button>
        <br />
        <span>Don't have an account? Then <a href="/sign-up">sign up</a>.</span>
      </form>
      <script src="/scripts/log-in.js"></script>
    `))
  ;
};

const signUp = (req, res) => {
  res
    .status(200)
    .send(htmlString('Sign up', `
      <h2 class="center-text">Sign up<h2>
      <form id="sign-up-form" action="#">
        <label for="full-name">Full name:</label>
        <input type="text" id="full-name" name="fullName" />
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" />
        <button type="submit" id="sign-up" name="signUp">Sign up</button>
        <br />
      </form>
      <script src="/scripts/sign-up.js"></script>
    `))
  ;
};

const dashboard = (req, res) => {
  res
    .status(200)
    .send(htmlString('Dashboard', `
      <form id="sign-up-form" action="#">
        <input type="text" id="full-name" name="fullName" value="${ req.session.fullName }" />
        <input type="text" id="username" name="username" value="${ req.session.username }" />
        <label>${ req.session.difficultyLevel }</label>
        <label>${ req.session.score }</label>
        <button type="submit" id="sign-up" name="signUp">Sign up</button>
        <br />
      </form>
      <script src="/scripts/sign-up.js"></script>
    `))
  ;
};

const postLogIn = (req, res) => {
  redisClient.hgetall('user:' + req.body.username, (err, user) => {
    req.session.username = req.body.username;
    req.session.fullName = user.fullName;
    req.session.difficultyLevel = user.difficultyLevel;
    req.session.score = user.score;
    res.redirect('/success');
  });
};

const postLogOut = (req, res) => {
  req.logout();
  res.redirect('/');
};

const postSignUp = (req, res) => {
  const fullName = req.body.fullName;
  const username = req.body.username;
  const password = req.body.password;

  credential().hash(password, (err, hash) => {
    redisClient.hmset(
      'user:' + username, 
      'fullName', fullName, 
      'hash', hash,
      'difficultyLevel', 'easy',
      'score', 0
    );
  });

  res.redirect('/sign-up');
};

export { 
  logIn, 
  signUp, 
  postLogIn, 
  postLogOut, 
  postSignUp,
  dashboard
};