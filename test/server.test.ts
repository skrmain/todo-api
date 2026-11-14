import { describe, expect, it } from 'vitest';
import request from 'supertest';

import { createServer } from '../src/server.js';

const server = createServer();

describe('api: health', () => {
    it('health', async () => {
        const response = await request(server).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
    it('not-found', async () => {
        const response = await request(server).get('/path-that-does-not-exists');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
        expect(JSON.stringify(response.body)).not.toMatch(/stack|at \w+ \(/i);
    });
});
