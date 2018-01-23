'use strict';

const createUser = () => {
  return { difficultyLevel: 'normal', firstTry: false };
};

const setDifficultyLevel = (user, value) => {
  user.difficultyLevel = value;
};

const generateEuroAmount = (user = { difficultyLevel: '', firstTry: false }) => {
  let endpoint = 0;
  let amount = 0.01;
  
  if (user.difficultyLevel === 'easy') 
    endpoint = 999.99
  ; else if (user.difficultyLevel === 'normal') 
    endpoint = 999999.99
  ; else if (user.difficultyLevel === 'hard') 
    endpoint = 999999999.99
  ; else 
    endpoint = 0
  ;

  amount = Math.floor(Math.random() * (endpoint - 0.01 + 1)) + 0.01;
  amount = Number(Math.round(Number(amount + 'e2')) + 'e-2').toFixed(2);
  user.firstTry = true;

  return amount;
};

const formatEuroAmount = (amount) => {
  const amountFormat = parseInt((Math.floor(Math.random() * (3 - 1 + 1)) + 1).toString());

  if (amountFormat === 1)
    return '€' + amount
  ; else if (amountFormat === 2)
    return (amount * 100) + 'c'
  ; else if (amountFormat === 3)
    return (amount * 100)
  ;
};

const sortAnswer = (arr = []) => {
  const result = [];
  
  const order = [
    '€2',
    '€1',
    '50c',
    '20c',
    '10c',
    '5c',
    '2c',
    '1c'
  ];

  order.map((element) => {
    arr.map((el) => {
      if (el.coin === element)
        result.push(el);
    });
  });

  return result;
};

/**
 * Function to remove the currency symbols (€, c) at 
 * the beginning and the end of what the user supplied
 * 
 * @param {String} value - input value supplied by the user
 */
const removeCurrencySymbol = (value) => {
  // gets rid of 'c' at the end if any
  if (value.substr(value.length - 1, 1) === 'c') {
    value = value.substr(0, value.length - 1);
  }

  // gets rid of '€' at the beginning if any
  if (value.substr(0, 1) === '€') {
    value = value.substr(1, value.length - 1);
  }

  return value;
};

/**
 * Function to get the canonical equivalent of the input
 * 
 * @param {String} value - input value
 */
const canonicalEquivalent = (value) => {
  let num = removeCurrencySymbol(value);
  let strArr = [];
  let beforeDecimalPoint = '';
  let afterDecimalPoint = '';

  strArr = num.split('.');
  beforeDecimalPoint = strArr[0]; // value before decimal place
  afterDecimalPoint = strArr[1] === undefined ? '' : strArr[1]; // value after decimal place, if there's any
  
  if (afterDecimalPoint) {
    return (Number(beforeDecimalPoint) * 100) + Number(afterDecimalPoint);
  } else {
    return Number(beforeDecimalPoint);
  }
};

/**
 * Function to determine the pound sterling coin(s) count 
 * and return a result based on what the user supplied
 * @param {String} value - input value supplied by the user
 */
const coinCounter = (value) => {
  let num; // variable to hold canonical equivalent
  let i = 0; // iterator
  let coinCount = 0; // variable to hold count for each of the common coins

  const commonCoins = [ // common coins set and their canonical equivalent values
    { label: '€2', value: 200 },
    { label: '€1', value: 100 },
    { label: '50c', value: 50 },
    { label: '20c', value: 20 },
    { label: '10c', value: 10 },
    { label: '5c', value: 5 },
    { label: '2c', value: 2 },
    { label: '1c', value: 1 }
  ];

  const result = []; // variable to hold result to be returned

  num = canonicalEquivalent(value); // get canonical equivalent

  while (true) {
    coinCount = Math.trunc(num/commonCoins[i].value); // get count for each of the common coins in the set
    num = num % commonCoins[i].value; // determine what value is left to still breakdown

    if (coinCount > 0) {
      result.push({ coin: commonCoins[i].label, count: coinCount });
    }
    
    if (num === 0) { // no value left to breakdown?
      break;
    } else {
      i++;
    }
  }

  return result; // result is returned
};

const checkAnswer = (user, userAnswer = [{ coin: '', count: 0 }], euroAmount) => {
  const expectedAnswer = coinCounter(euroAmount);
  let isCorrect = true;
  
  if (userAnswer.length === expectedAnswer.length) {
    userAnswer.map((element, i) => {
      if (element.coin !== expectedAnswer[i].coin || element.count !== expectedAnswer[i].count) {
        isCorrect = false;
        if (user.firstTry) user.firstTry = false;
      }
    });
  } else {
    isCorrect = false;
    if (user.firstTry) user.firstTry = false;
  }

  return isCorrect;
};

const givePoints = (user, isCorrect) => {
  if (isCorrect && user.firstTry)
    user.points += 3
  ; else if (isCorrect && !(user.firstTry))
    user.points += 2
  ;
};

export { 
  createUser, 
  setDifficultyLevel, 
  generateEuroAmount, 
  formatEuroAmount, 
  sortAnswer, 
  removeCurrencySymbol,
  canonicalEquivalent, 
  coinCounter, 
  checkAnswer, 
  givePoints 
};