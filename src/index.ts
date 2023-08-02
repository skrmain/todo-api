import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { app } from './server';
import config from './config';
import logger from './shared/logger';

(async () => {
    try {
        const con = await connect(config.mongodbUri, { dbName: 'test' });
        logger.verbose(`⚡️[MongoDB] Connected to '${con.connection.name}' DB`);
    } catch (error) {
        logger.error('[MongoDB] Error 🙈 ', { error });
        process.exit(1);
    }

    app.listen(config.port, () => {
        logger.verbose(`⚡️[NODE_ENV]: ${config.env}`);
        logger.verbose(`⚡️[Server]: Listening at ${config.port}`);
    });
})();
