import { config } from './config/index.js';
import { connectDb } from './db/index.js';
import { createServer } from './server.js';

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

const shutdown = () => {
    server.close(() => process.exit(0));
    server.closeIdleConnections();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
