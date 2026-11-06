function sendJson(res, status, body) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
    const chunks = [];
    let size = 0;

    for await (const chunk of req) {
        size += chunk.length;
        if (size > 1_000_000) {
            const error = new Error('Request body is too large');
            error.statusCode = 413;
            throw error;
        }
        chunks.push(chunk);
    }

    try {
        return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
        const error = new Error('Invalid JSON body');
        error.statusCode = 400;
        throw error;
    }
}

function getTodoFields(body, partial = false) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return null;
    }

    const fields = {};
    if ('title' in body) {
        if (typeof body.title !== 'string' || body.title.trim() === '') {
            return null;
        }
        fields.title = body.title.trim();
    }
    if ('completed' in body) {
        if (typeof body.completed !== 'boolean') {
            return null;
        }
        fields.completed = body.completed;
    }

    if (!partial && !('title' in fields)) {
        return null;
    }
    if (partial && Object.keys(fields).length === 0) {
        return null;
    }

    return fields;
}

export function createTodoRouter(repository) {
    return async function handleTodoRequest(req, res) {
        const { pathname } = new URL(req.url, 'http://localhost');

        if (pathname === '/todos' || pathname === '/todos/') {
            if (req.method === 'GET') {
                sendJson(res, 200, { todos: repository.list() });
                return;
            }
            if (req.method === 'POST') {
                try {
                    const body = await readJsonBody(req);
                    const fields = getTodoFields(body);
                    if (!fields) {
                        sendJson(res, 400, { error: 'Invalid todo' });
                        return;
                    }
                    const todo = repository.create({ title: fields.title, completed: fields.completed ?? false });
                    sendJson(res, 201, { todo });
                } catch (error) {
                    const status = error.statusCode ?? 500;
                    sendJson(res, status, { error: status === 500 ? 'Internal server error' : error.message });
                }
                return;
            }

            sendJson(res, 405, { error: 'Method not allowed' });
            return;
        }

        const match = pathname.match(/^\/todos\/(\d+)$/);
        if (!match) {
            sendJson(res, 404, { error: 'Not found' });
            return;
        }

        const id = Number(match[1]);
        if (!Number.isSafeInteger(id)) {
            sendJson(res, 404, { error: 'Todo not found' });
            return;
        }

        if (req.method === 'GET') {
            const todo = repository.get(id);
            if (!todo) {
                sendJson(res, 404, { error: 'Todo not found' });
                return;
            }
            sendJson(res, 200, { todo });
            return;
        }

        if (req.method === 'PUT' || req.method === 'PATCH') {
            try {
                const body = await readJsonBody(req);
                const fields = getTodoFields(body, req.method === 'PATCH');
                if (!fields) {
                    sendJson(res, 400, { error: 'Invalid todo' });
                    return;
                }
                const changes = req.method === 'PUT'
                    ? { title: fields.title, completed: fields.completed ?? false }
                    : fields;
                const todo = repository.update(id, changes);
                if (!todo) {
                    sendJson(res, 404, { error: 'Todo not found' });
                    return;
                }
                sendJson(res, 200, { todo });
            } catch (error) {
                const status = error.statusCode ?? 500;
                sendJson(res, status, { error: status === 500 ? 'Internal server error' : error.message });
            }
            return;
        }

        if (req.method === 'DELETE') {
            if (!repository.delete(id)) {
                sendJson(res, 404, { error: 'Todo not found' });
                return;
            }
            res.writeHead(204);
            res.end();
            return;
        }

        sendJson(res, 405, { error: 'Method not allowed' });
    };
}
