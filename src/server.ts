import app from './app.js';
import { env } from './config/index.js';

const server = app.listen(env.PORT);

server.on('listening', () => {
    console.log(`PID: ${process.pid} | Server is listening on port ${env.PORT}`);
});

server.on('error', (err) => {
    console.error(`PID: ${process.pid} | Server error:`, err);
    process.exit(1);
});

/**
 * Handles graceful shutdown of the server on receiving termination signals.
 * - `SIGINT` -- handle `Ctrl+C` interrupt signal for graceful shutdown
 * - `SIGTERM` -- handle termination signal for graceful shutdown
 */
let shuttingDown = false;

function gracefulShutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`PID: ${process.pid} received ${signal}, closing...`);

    // Stop accepting new connections, wait for in-flight requests
    server.close(async () => {
        // close DB / Redis connections here
        process.exit(0);
    });

    // Close idle keep-alive connections so close() can finish (Node 18.2+)
    server.closeIdleConnections();

    // Safety net: force exit if something hangs
    setTimeout(() => {
        console.error(`PID: ${process.pid} forced exit`);
        process.exit(1);
    }, 10_000).unref();
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
