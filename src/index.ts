import { createServer } from './server.js';

const PORT = process.env.PORT || 8000;

const server = createServer();

server.on('listening', () => {
    console.log(`Server is listening on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});

server.listen(PORT);

/**
 * Handles graceful shutdown of the server on receiving termination signals.
 * - `SIGINT` -- handle `Ctrl+C` interrupt signal for graceful shutdown
 * - `SIGTERM` -- handle termination signal for graceful shutdown
 */
function gracefulShutdown(signal: 'SIGINT' | 'SIGTERM') {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(() => process.exit(0));
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
