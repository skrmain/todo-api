import http from 'node:http';
import { createTodoController } from './modules/todo/todo.controller.js';
import { createTodoRepository } from './modules/todo/todo.repository.js';
import { registerTodoRoutes } from './modules/todo/todo.routes.js';
import { createTodoService } from './modules/todo/todo.service.js';
import { createRouter } from './routes/router.js';
import { sendJson } from './utils/index.js';

export function createServer() {
    const router = createRouter();
    const todoRepository = createTodoRepository();
    const todoService = createTodoService(todoRepository);
    const todoController = createTodoController(todoService);
    registerTodoRoutes(router, todoController);

    return http.createServer((req, res) => {
        console.log(`${req.method} ${req.url}`);

        if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
            sendJson(res, 200, { status: 'ok' });
            return;
        }

        void router.handle(req, res);
    });
}
