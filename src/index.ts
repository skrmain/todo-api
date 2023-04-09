import dotenv from 'dotenv';
dotenv.config();

import { app } from './server';
import { Database } from './shared/database';
import config from './config';

(async () => {
    await Database.connect(config.mongodbUri);

    app.listen(config.port, () => {
        console.log(`⚡️[NODE_ENV]: ${config.env}`);
        console.log(`⚡️[Server]: Listening at ${config.port}`);
    });
})();
