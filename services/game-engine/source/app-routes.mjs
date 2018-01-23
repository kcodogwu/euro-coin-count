'use strict';

import * as appHanders from './app-handlers';

const appRouter = app => {
  app.get('/difficulty-level', appHanders.difficulty_level);
  app.get('/game', appHanders.game);
};

export { appRouter };