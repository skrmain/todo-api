import http from 'node:http';

function getTodos() {
    return { todos: [] };
}

export function createServer() {
    return http.createServer((req, res) => {
        console.log(`${req.method} ${req.url}`);

        if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok' }));
            return;
        }

        if (req.method === 'GET' && req.url === '/todos') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(getTodos()));
            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    });
}
