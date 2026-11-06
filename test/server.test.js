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

test('unknown route returns 404', async () => {
    const res = await fetch(`${baseUrl}/nope`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'Not found' });
});
