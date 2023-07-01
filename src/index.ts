import dotenv from 'dotenv';
dotenv.config();

import { app } from './server';
import { MongooseOperationsWrapper } from './shared/mongoose-operations-wrapper';
import config from './config';
import logger from './shared/logger';

// NOTE: Not needed
// logger.defaultMeta = { ...logger.defaultMeta, fileName: __filename };

(async () => {
    await MongooseOperationsWrapper.connect(config.mongodbUri);

    app.listen(config.port, () => {
        logger.verbose(`⚡️[NODE_ENV]: ${config.env}`);
        logger.verbose(`⚡️[Server]: Listening at ${config.port}`);
    });
})();
