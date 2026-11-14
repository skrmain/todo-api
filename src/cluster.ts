import cluster from 'node:cluster';
import { env } from './config/index.js';

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} starting ${env.WORKERS} workers`);

    let shuttingDown = false;

    for (let i = 0; i < env.WORKERS; i++) cluster.fork();

    cluster.on('exit', (worker, code) => {
        if (shuttingDown) return;
        if (code === 1) {
            console.error(`Worker ${worker.process.pid} failed to start. Not restarting.`);
            return;
        }
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

    const shutdown = (signal: string) => {
        if (shuttingDown) return;
        shuttingDown = true;
        console.log(`Primary received ${signal}, stopping workers...`);

        for (const worker of Object.values(cluster.workers ?? {})) {
            worker?.process.kill('SIGTERM');
        }

        // Primary exits on its own once all workers are gone
        setTimeout(() => process.exit(1), 15_000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
} else {
    await import('./server.js');
}
