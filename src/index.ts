import config from './config';
import { connect } from 'mongoose';

import { app } from './server';
import logger from './common/logger';

(async () => {
    logger.verbose(`⚡️[MongoDB] Connecting to DB ${config.dbName}`);
    const con = await connect(config.mongodbUri, { dbName: config.dbName });
    logger.verbose(`⚡️[MongoDB] Connected to '${con.connection.name}' DB`);

    app.listen(config.port, () => logger.verbose(`⚡️[Server]: Listening at ${config.port}`));
})();
