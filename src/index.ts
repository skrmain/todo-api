import { config } from './config/index.js';
import { connectDb } from './db/index.js';
import { createServer } from './server.js';

(async () => {
    await connectDb(config.MONGODB_URI, config.DB_NAME);

    const app = createServer();

    const server = app.listen(config.PORT);

    server.on('listening', () => {
        console.log(`server: Listening on '${config.PORT}' port`);
    });

    server.on('error', (error) => {
        console.error(`server: Failed to listen on '${config.PORT}' port`, error);
        process.exit(1);
    });
})();
