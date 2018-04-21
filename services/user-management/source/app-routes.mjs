'use strict';

import LocalStrategy from 'passport-local';
import credential from 'credential';
import * as appHanders from './app-handlers';
import { redisClient } from './app-db-access';

const appRouter = (app, passport) => {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      redisClient.hgetall('user:' + username, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        credential().verify(user.hash, password, (err, isValid) => {
          if (err) {
            return done(null, false);
          }

          if (!isValid) {
            return done(null, false);
          }
  
          return done(null, user);
        });
      });
    }
  ));

  // GET
  app.get('/', appHanders.logIn);
  app.get('/log-in', appHanders.logIn);
  app.get('/sign-up', appHanders.signUp);
  app.get('/success', (req, res) => res.send('Welcome '+req.session.username+'!!'));
  // POST
  app.post('/post-log-in',  passport.authenticate('local', { failureRedirect: '/' }), appHanders.postLogIn);
  app.post('/post-sign-up', appHanders.postSignUp);
};

export { appRouter };