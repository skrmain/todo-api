import { RequestHandler } from 'express';

export const requestLoggerMiddleware: RequestHandler = (req, res, next): void => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date(start).toISOString();
        console.log(
            `PID: ${process.pid} | ${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
        );
    });

    next();
};
