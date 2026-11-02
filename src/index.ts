import config from './config/index.js';
import { connectDb } from './db/index.js';
import { createServer } from './server.js';

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
