'use strict';

import test from 'tape';
import request from 'supertest';
import { app } from '../source/app.mjs';

test('get /difficulty-level', assert => {
  request(app)
    .get('/difficulty-level')
    .expect(200)
    .end((err, res) => {
      const msg = 'should return 200 OK';

      if (err) assert.fail(msg);
      else assert.pass(msg);
      assert.end();
    });
});

test('get /game', assert => {
  request(app)
    .get('/game')
    .expect(200)
    .end((err, res) => {
      const msg = 'should return 200 OK';

      if (err) assert.fail(msg);
      else assert.pass(msg);
      assert.end();
    });
});