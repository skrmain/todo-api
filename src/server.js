import http from 'node:http';
import { createTodoRepository } from './repositories/todoRepository.js';
import { createTodoRouter } from './routes/todos.js';
import { sendJson } from './utils/index.js';

export function createServer() {
    const handleTodoRequest = createTodoRouter(createTodoRepository());

    return http.createServer((req, res) => {
        console.log(`${req.method} ${req.url}`);

        if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
            sendJson(res, 200, { status: 'ok' });
            return;
        }

        const { pathname } = new URL(req.url, 'http://localhost');
        if (pathname === '/todos' || pathname.startsWith('/todos/')) {
            void handleTodoRequest(req, res);
            return;
        }

        sendJson(res, 404, { error: 'Not found' });
    });
}
