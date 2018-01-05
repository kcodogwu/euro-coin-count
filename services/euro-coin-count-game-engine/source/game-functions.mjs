'use strict';

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
  let num = Number(removeCurrencySymbol(value));
  let strArr = [];
  let beforeDecimalPoint = '';
  let afterDecimalPoint = '';

  num = Math.round(num * 100) / 100; // round to 2 decimal places
  strArr = num.toString().split('.');
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
      result.push(`${ coinCount } x ${ commonCoins[i].label }`);
    }
    
    if (num === 0) { // no value left to breakdown?
      break;
    } else {
      i++;
    }
  }

  return result; // result is returned
};

export { canonicalEquivalent };