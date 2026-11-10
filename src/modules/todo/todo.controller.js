import { readJsonBody, sendJson } from '../../utils/index.js';

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

function sendRequestError(res, error) {
    const status = error.statusCode ?? 500;
    sendJson(res, status, { error: status === 500 ? 'Internal server error' : error.message });
}

export function createTodoController(service) {
    return {
        list(req, res) {
            sendJson(res, 200, { todos: service.listTodos() });
        },
        async create(req, res) {
            try {
                const fields = getTodoFields(await readJsonBody(req));
                if (!fields) {
                    sendJson(res, 400, { error: 'Invalid todo' });
                    return;
                }
                const todo = service.createTodo({
                    title: fields.title,
                    completed: fields.completed ?? false,
                });
                sendJson(res, 201, { todo });
            } catch (error) {
                sendRequestError(res, error);
            }
        },
        get(req, res, { params }) {
            const id = Number(params.id);
            if (!Number.isSafeInteger(id)) {
                sendJson(res, 404, { error: 'Todo not found' });
                return;
            }

            const todo = service.getTodo(id);
            if (!todo) {
                sendJson(res, 404, { error: 'Todo not found' });
                return;
            }
            sendJson(res, 200, { todo });
        },
        async update(req, res, { params }) {
            try {
                const isPatch = req.method === 'PATCH';
                const fields = getTodoFields(await readJsonBody(req), isPatch);
                if (!fields) {
                    sendJson(res, 400, { error: 'Invalid todo' });
                    return;
                }
                const changes = isPatch
                    ? fields
                    : { title: fields.title, completed: fields.completed ?? false };
                const todo = service.updateTodo(Number(params.id), changes);
                if (!todo) {
                    sendJson(res, 404, { error: 'Todo not found' });
                    return;
                }
                sendJson(res, 200, { todo });
            } catch (error) {
                sendRequestError(res, error);
            }
        },
        delete(req, res, { params }) {
            if (!service.deleteTodo(Number(params.id))) {
                sendJson(res, 404, { error: 'Todo not found' });
                return;
            }
            res.writeHead(204);
            res.end();
        },
    };
}
