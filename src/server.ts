import express from 'express';

export function createServer() {
    const app = express();

    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    app.get('/', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.use((_req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    return app;
}
