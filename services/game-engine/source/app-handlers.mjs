'use strict';

import * as gameFunctions from './game-functions';

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

const difficulty_level = (req, res) => {
  res
    .status(200)
    .send(htmlString('', `
      <h2 class="center-text">Select difficulty level<h2>
      <form id="coin-count-form" action="#">
        <button type="submit" name="easy">Easy</button>
        <button type="submit" name="normal">Normal</button>
        <button type="submit" name="hard">Hard</button>
      </form>
    `))
  ;
};

const game = (req, res) => {
  res
    .status(200)
    .send(htmlString('', `
      <form id="coin-count-form"  action="#">
        <label>What's the breakdown for:</label>
        <div class="euro-amount center-text">${ gameFunctions.formatEuroAmount(gameFunctions.generateEuroAmount({ difficultyLevel: 'easy', firstTry: false })) }</div>
        <div id="result">
          <div class="result-child">
            <span class="">
              <input type="number" class="" name="coinCount1" />
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
      <script src="/scripts/game.js"></script>
    `))
  ;
};

export { difficulty_level, game };