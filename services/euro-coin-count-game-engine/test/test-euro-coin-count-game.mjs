'use strict';

// load modules
import test from 'tape';
import game from '..';

const errorMsg = `INVALID INPUT!

Please enter valid inputs like:  432, 213p, £16.23p, £14, £54.04, £23.33333, 001.41p,...`;

test('Test the coin counting function', assert => {
  assert.equal(
    game('13x'),
    errorMsg,
    'Given invalid input, should return a message that shows invalid input.'
  );

  assert.equal(
    game('13p.02'),
    errorMsg,
    'Given invalid input, should return a message that shows invalid input.'
  );

  assert.equal(
    game('£p'),
    errorMsg,
    'Given invalid input, should return a message that shows invalid input.'
  );

  assert.equal(
    (game('432') !== errorMsg) && (game('432') !== undefined),
    true,
    'Given valid input, should not return a message that shows invalid input.'
  );

  assert.equal(
    (game('213p') !== errorMsg) && (game('432') !== undefined),
    true,
    'Given valid input, should not return a message that shows invalid input.'
  );

  assert.equal(
    (game('£16.23p') !== errorMsg) && (game('432') !== undefined),
    true,
    'Given valid input, should not return a message that shows invalid input.'
  );

  assert.equal(
    (game('£14') !== errorMsg) && (game('432') !== undefined),
    true,
    'Given valid input, should not return a message that shows invalid input.'
  );

  assert.equal(
    (game('£54.04') !== errorMsg) && (game('432') !== undefined),
    true,
    'Given valid input, should not return a message that shows invalid input.'
  );

  assert.equal(
    (game('£23.33333') !== errorMsg) && (game('432') !== undefined),
    true,
    'Given valid input, should not return a message that shows invalid input.'
  );

  assert.equal(
    (game('001.41p') !== errorMsg) && (game('432') !== undefined),
    true,
    'Given valid input, should not return a message that shows invalid input.'
  );

  assert.equal(
    game('123p').join(', '),
    '1 x £1, 1 x 20p, 1 x 2p, 1 x 1p',
    'Given valid input, should return expectted breakdown, starting with the highest coin and then descending till total amount is achieved.'
  );

  assert.equal(
    game('£12.34').join(', '),
    '6 x £2, 1 x 20p, 1 x 10p, 2 x 2p',
    'Given valid input, should return expectted breakdown, starting with the highest coin and then descending till total amount is achieved.'
  );

  assert.end();
});