import config from './config';

import { connectDb } from './db';
import { createServer } from './server';

(async () => {
    await connectDb(config.mongodbUri, config.dbName);

    const app = createServer();

    const server = app.listen(config.port);

    server.on('listening', () => {
        console.log(`server: Listening on '${config.port}' port`);
    });

    server.on('error', (error) => {
        console.error(`server: Failed to listen on '${config.port}' port`, error);
        process.exit(1);
    });
})();
