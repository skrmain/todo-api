import { createServer as createHttpServer } from 'node:http';

export function createServer() {
    return createHttpServer((req, res) => {
        console.log(`${req.method} ${req.url}`);

        if (req.method === 'GET' && req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok' }));
            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    });
}
