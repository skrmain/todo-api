import express from 'express';
import cors from 'cors';

import { errorHandlerMiddleware } from './middlewares/error-handler.js';
import { notFoundMiddleware } from './middlewares/not-found.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.js';

import { todoRoutes } from './apps/todo/todo.routes.js';
import { authRoutes } from './apps/auth/auth.routes.js';
import { userRoutes } from './apps/user/user.routes.js';

import { checkAuth, parseJson } from './common/middleware.js';

export function createServer() {
    const app = express();

    app.use(requestLoggerMiddleware);
    app.use(cors());
    app.use(parseJson);

    app.get('/', (_req, res) => res.send({ message: 'Ok' }));
    app.use('/', authRoutes);
    app.use('/todos', checkAuth, todoRoutes);
    app.use('/user', checkAuth, userRoutes);

    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);

    return app;
}
