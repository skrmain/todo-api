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

export function createTodoController(service) {
    return {
        list(req, res) {
            res.json({ todos: service.listTodos() });
        },
        create(req, res) {
            const fields = getTodoFields(req.body);
            if (!fields) {
                res.status(400).json({ error: 'Invalid todo' });
                return;
            }
            const todo = service.createTodo({
                title: fields.title,
                completed: fields.completed ?? false,
            });
            res.status(201).json({ todo });
        },
        get(req, res) {
            const id = Number(req.params.id);
            if (!Number.isSafeInteger(id)) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }

            const todo = service.getTodo(id);
            if (!todo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            res.json({ todo });
        },
        update(req, res) {
            const isPatch = req.method === 'PATCH';
            const fields = getTodoFields(req.body, isPatch);
            if (!fields) {
                res.status(400).json({ error: 'Invalid todo' });
                return;
            }
            const id = Number(req.params.id);
            const changes = isPatch
                ? fields
                : { title: fields.title, completed: fields.completed ?? false };
            const todo = Number.isSafeInteger(id) ? service.updateTodo(id, changes) : null;
            if (!todo) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            res.json({ todo });
        },
        delete(req, res) {
            const id = Number(req.params.id);
            if (!Number.isSafeInteger(id) || !service.deleteTodo(id)) {
                res.status(404).json({ error: 'Todo not found' });
                return;
            }
            res.status(204).end();
        },
    };
}
