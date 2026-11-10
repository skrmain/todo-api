import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { createServer } from '../src/server.js';

let server;
let baseUrl;

before(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, resolve)); // port 0 = random free port
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
});

after(async () => {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

test('GET /health returns 200 and ok status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
});

test('GET / returns 200 and ok status', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
});

test('todos can be created, read, updated, and deleted', async () => {
    const initialListResponse = await fetch(`${baseUrl}/todos`);
    assert.deepEqual(await initialListResponse.json(), { todos: [] });

    const createResponse = await fetch(`${baseUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '  Write tests  ' }),
    });
    assert.equal(createResponse.status, 201);
    const { todo: createdTodo } = await createResponse.json();
    assert.deepEqual(createdTodo, { id: 1, title: 'Write tests', completed: false });

    const listResponse = await fetch(`${baseUrl}/todos`);
    assert.deepEqual(await listResponse.json(), { todos: [createdTodo] });

    const getResponse = await fetch(`${baseUrl}/todos/${createdTodo.id}`);
    assert.deepEqual(await getResponse.json(), { todo: createdTodo });

    const replaceResponse = await fetch(`${baseUrl}/todos/${createdTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Review tests', completed: true }),
    });
    const { todo: replacedTodo } = await replaceResponse.json();
    assert.deepEqual(replacedTodo, { ...createdTodo, title: 'Review tests', completed: true });

    const updateResponse = await fetch(`${baseUrl}/todos/${createdTodo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: false }),
    });
    assert.deepEqual(await updateResponse.json(), {
        todo: { ...createdTodo, title: 'Review tests', completed: false },
    });

    const deleteResponse = await fetch(`${baseUrl}/todos/${createdTodo.id}`, { method: 'DELETE' });
    assert.equal(deleteResponse.status, 204);

    const missingResponse = await fetch(`${baseUrl}/todos/${createdTodo.id}`);
    assert.equal(missingResponse.status, 404);
});

test('creating a todo requires a non-empty title', async () => {
    const res = await fetch(`${baseUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '  ' }),
    });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'Invalid todo' });
});

test('unknown route returns 404', async () => {
    const res = await fetch(`${baseUrl}/nope`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'Not found' });
});

test('unsupported method on a known route returns 405', async () => {
    const res = await fetch(`${baseUrl}/todos`, { method: 'DELETE' });
    assert.equal(res.status, 405);
    assert.deepEqual(await res.json(), { error: 'Method not allowed' });
});
