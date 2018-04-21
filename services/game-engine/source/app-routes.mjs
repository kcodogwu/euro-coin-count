'use strict';

import * as appHanders from './app-handlers';

const appRouter = app => {
  app.get('/difficulty-level', appHanders.difficultyLevel);
  app.get('/game', appHanders.game);
};

export { appRouter };