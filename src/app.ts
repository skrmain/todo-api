import express from 'express';

import { todoRoutes } from './modules/todo/todo.routes.js';

import { requestLoggerMiddleware } from './middlewares/request-logger.js';
import { notFoundMiddleware } from './middlewares/not-found.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.js';

const app = express();

app.use(requestLoggerMiddleware);

app.use(express.json({ limit: '2kb' }));

app.get('/', (_req, res) => res.json({ status: 'ok' }));

app.use('/todos', todoRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
