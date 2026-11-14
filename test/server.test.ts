import { describe, expect, it } from 'vitest';
import request from 'supertest';

import app from './../src/app.js';

describe('api: health', () => {
    it('health', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
    it('not-found', async () => {
        const response = await request(app).get('/path-that-does-not-exists');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
        expect(JSON.stringify(response.body)).not.toMatch(/stack|at \w+ \(/i);
    });
});
