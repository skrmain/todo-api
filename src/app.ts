import express from 'express';

const app = express();

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        console.log(`PID: ${process.pid} | ${req.method} ${req.url} ${res.statusCode} - ${Date.now() - start}ms`);
    });

    next();
});

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

export default app;
