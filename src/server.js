import { createServer as createHttpServer } from 'node:http';
import express from 'express';
import { createTodoController } from './modules/todo/todo.controller.js';
import { createTodoRepository } from './modules/todo/todo.repository.js';
import { createTodoRouter } from './modules/todo/todo.routes.js';
import { createTodoService } from './modules/todo/todo.service.js';

export function createServer() {
    const app = express();
    const todoRepository = createTodoRepository();
    const todoService = createTodoService(todoRepository);
    const todoController = createTodoController(todoService);

    app.use(express.json({ limit: '1mb' }));
    app.get(['/health', '/'], (req, res) => {
        res.json({ status: 'ok' });
    });
    app.use('/todos', createTodoRouter(todoController));

    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    app.use((error, req, res, next) => {
        const status = error.status === 413 ? 413 : error.status === 400 ? 400 : 500;
        const message = status === 413
            ? 'Request body is too large'
            : status === 400
                ? 'Invalid JSON body'
                : 'Internal server error';
        res.status(status).json({ error: message });
    });

    return createHttpServer(app);
}
