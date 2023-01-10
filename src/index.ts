import dotenv from 'dotenv';

import { app } from './server';
import { connectMongoDB } from './shared/utils';
import config from './config';

dotenv.config();

(async () => {
  await connectMongoDB(config.mongodb_uri);

  app.listen(config.port, () => {
    console.log(`⚡️[NODE_ENV]: ${config.env}`);
    console.log(`⚡️[Server]: Listening at ${config.port}`);
  });
})();
