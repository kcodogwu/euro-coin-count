'use strict';

// load modules
import { app, server } from './app';

const startServer = () => {
  server.listen(app.get('port'), app.get('host'), (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(`Listening at http://${ app.get('host') } on port ${ app.get('port') } in ${ app.get('env') } mode; Press Ctrl+C to cancel.`);
  });
};

startServer();

export default startServer;