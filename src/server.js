import http from 'node:http';
import { createTodoRepository } from './repositories/todoRepository.js';
import { createTodoRouter } from './routes/todos.js';

export function createServer() {
    const handleTodoRequest = createTodoRouter(createTodoRepository());

    return http.createServer((req, res) => {
        console.log(`${req.method} ${req.url}`);

        if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok' }));
            return;
        }

        const { pathname } = new URL(req.url, 'http://localhost');
        if (pathname === '/todos' || pathname.startsWith('/todos/')) {
            void handleTodoRequest(req, res);
            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    });
}
