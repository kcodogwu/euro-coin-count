'use strict';

// load modules
import test from 'tape';
import * as gameFunctions from '../source/game-functions';

test('Test amount generated is never less than 0.01', assert => {
  let actual = false;
  const expected = true;
  const user = gameFunctions.createUser();

  gameFunctions.setDifficultyLevel(user, 'easy');

  [1, 2, 3, 4, 5, 6, 7].map(() => {
    actual = gameFunctions.generateEuroAmount(user) >= 0.01;
  });

  gameFunctions.setDifficultyLevel(user, 'normal');

  [1, 2, 3, 4, 5, 6, 7].map(() => {
    actual = gameFunctions.generateEuroAmount(user) >= 0.01;
  });

  gameFunctions.setDifficultyLevel(user, 'hard');

  [1, 2, 3, 4, 5, 6, 7].map(() => {
    actual = gameFunctions.generateEuroAmount(user) >= 0.01;
  });

  assert.equal(
    actual,
    expected,
    'generateEuroAmount() should never produce a number less than 0.01'
  );

  assert.end();
});

test('Test amount generated within the "easy" range.', assert => {
  let amount = 0;
  let actual = false;
  const expected = true;
  const user = gameFunctions.createUser();

  gameFunctions.setDifficultyLevel(user, 'easy');
  amount = gameFunctions.generateEuroAmount(user);

  [1, 2, 3, 4, 5, 6, 7].map(() => {
    actual = amount >= 0.01 && amount <= 999.99;
  });

  assert.equal(
    actual,
    expected,
    'generateEuroAmount() should never produce a number greater than 999.99'
  );

  assert.end();
});

test('Test amount generated within the "normal" range.', assert => {
  let amount = 0;
  let actual = false;
  const expected = true;
  const user = gameFunctions.createUser();

  gameFunctions.setDifficultyLevel(user, 'normal');
  amount = gameFunctions.generateEuroAmount(user);

  [1, 2, 3, 4, 5, 6, 7].map(() => {
    actual = amount >= 0.01 && amount <= 999999.99;
  });

  assert.equal(
    actual,
    expected,
    'generateEuroAmount() should never produce a number greater than 999999.99'
  );

  assert.end();
});

test('Test amount generated within the "hard" range.', assert => {
  let amount = 0;
  let actual = false;
  const expected = true;
  const user = gameFunctions.createUser();

  gameFunctions.setDifficultyLevel(user, 'hard');
  amount = gameFunctions.generateEuroAmount(user);

  [1, 2, 3, 4, 5, 6, 7].map(() => {
    actual = amount >= 0.01 && amount <= 999999999.99;
  });

  assert.equal(
    actual,
    expected,
    'generateEuroAmount() should never produce a number greater than 999999999.99'
  );

  assert.end();
});

test('Test that answer supplied by the user can be sorted', assert => {
  const actual = gameFunctions.sortAnswer([
    { coin: '€2', count: 1 },
    { coin: '2c', count: 1 },
    { coin: '5c', count: 1 },
    { coin: '10c', count: 1 },
    { coin: '20c', count: 1 },
    { coin: '50c', count: 1 },
    { coin: '€1', count: 1 },
    { coin: '1c', count: 1 }
  ]);

  const expected = [
    { coin: '€2', count: 1 },
    { coin: '€1', count: 1 },
    { coin: '50c', count: 1 },
    { coin: '20c', count: 1 },
    { coin: '10c', count: 1 },
    { coin: '5c', count: 1 },
    { coin: '2c', count: 1 },
    { coin: '1c', count: 1 }
  ];

  assert.deepEqual(
    actual,
    expected,
    'Answers supplied by the user should be sorted'
  );

  assert.end();
});

test('Test that the answer the user supplied and the expected answer can be properly compared', nested => {
  nested.test('When the supplied answer is wrong', assert => {
    const actual = gameFunctions.checkAnswer(
      [{ coin: '€2', count: 2 }, { coin: '€1', count: 1 }],
      [{ coin: '€2', count: 3 }, { coin: '€1', count: 1 }]
    );
  
    const expected = 'wrong';

    assert.equal(
      actual,
      expected,
      'The result should be "wrong"'
    );
  
    assert.end();
  });

  nested.test('When the supplied answer is right', assert => {
    const actual = gameFunctions.checkAnswer(
      [{ coin: '€2', count: 3 }, { coin: '€1', count: 1 }],
      [{ coin: '€2', count: 3 }, { coin: '€1', count: 1 }]
    );
  
    const expected = 'right';
    
    assert.equal(
      actual,
      expected,
      'The result should be "right"'
    );
  
    assert.end();
  });
});

test('Test points allocation for getting the correct answer on 1st try', assert => {
  const actual = gameFunctions.givePoints();
  const expected = 3;

  assert.equal(
    actual,
    expected,
    'Gets 3 points for accurately getting the answer on first try'
  );

  assert.end();
});

test('Test points allocation for getting the correct answer after 1st try', assert => {
  const actual = gameFunctions.givePoints();
  const expected = 2;

  assert.equal(
    actual,
    expected,
    'Gets 2 points for accurately getting the answer after first try'
  );

  assert.end();
});

test('Test points allocation for not getting the correct answer', assert => {
  const actual = gameFunctions.givePoints();
  const expected = 0;

  assert.equal(
    actual,
    expected,
    'Gets 0 points for not getting the answer'
  );

  assert.end();
});