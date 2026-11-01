import express from 'express';
import cors from 'cors';

import { errorHandlerMiddleware } from './middlewares/error-handler.js';
import { notFoundMiddleware } from './middlewares/not-found.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.js';

import UserRoutes from './apps/user/user.routes';
import AuthRouter from './apps/auth/auth.routes';
import { todoRoutes } from './apps/todo/todo.routes.js';

import { checkAuth, parseJson } from './common/middleware.js';

export function createServer() {
    const app = express();

    app.use(requestLoggerMiddleware);
    app.use(cors());
    app.use(parseJson);

    app.use(express.json({ limit: '100kb' }));

    app.use(express.urlencoded({ extended: true }));
    app.get('/', (_req, res) => res.send({ message: 'Ok' }));
    app.use('/', AuthRouter);
    app.use('/todos', checkAuth, todoRoutes);
    app.use('/user', checkAuth, UserRoutes);
    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);

    return app;
}
