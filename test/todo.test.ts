import { describe, expect, it } from 'vitest';
import request from 'supertest';

import app from './../src/app.js';

describe('api: todos', () => {
    it('creates a todo and returns it in the todo list', async () => {
        const createResponse = await request(app)
            .post('/todos')
            .send({ title: '  Buy groceries  ', description: 'Milk and bread' });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body).toMatchObject({
            id: expect.any(String),
            title: 'Buy groceries',
            description: 'Milk and bread',
            completed: false,
            isDeleted: false,
        });

        const listResponse = await request(app).get('/todos');

        expect(listResponse.status).toBe(200);
        expect(listResponse.body).toContainEqual(createResponse.body);
    });

    it('updates an incomplete todo and rejects updates after completion', async () => {
        const createResponse = await request(app).post('/todos').send({ title: 'Draft report' });
        const todoId = createResponse.body.id;

        const updateResponse = await request(app)
            .put(`/todos/${todoId}`)
            .send({ title: 'Finish report' });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.title).toBe('Finish report');

        const completeResponse = await request(app)
            .put(`/todos/${todoId}`)
            .send({ completed: true });

        expect(completeResponse.status).toBe(200);
        expect(completeResponse.body.completed).toBe(true);

        const rejectedUpdateResponse = await request(app)
            .put(`/todos/${todoId}`)
            .send({ title: 'Change completed report' });

        expect(rejectedUpdateResponse.status).toBe(400);
        expect(rejectedUpdateResponse.body.error.message).toBe('Cannot update a completed todo');
    });

    it('soft-deletes a todo and prevents further updates', async () => {
        const createResponse = await request(app).post('/todos').send({ title: 'Archive notes' });
        const todoId = createResponse.body.id;

        const deleteResponse = await request(app).delete(`/todos/${todoId}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.isDeleted).toBe(true);
        expect(deleteResponse.body.deletedAt).toEqual(expect.any(String));

        const updateResponse = await request(app)
            .put(`/todos/${todoId}`)
            .send({ title: 'Update archived notes' });

        expect(updateResponse.status).toBe(404);
        expect(updateResponse.body.error.code).toBe('NOT_FOUND');
    });

    it('rejects invalid todo input and unknown todo IDs', async () => {
        const invalidCreateResponse = await request(app).post('/todos').send({ title: '   ' });

        expect(invalidCreateResponse.status).toBe(400);
        expect(invalidCreateResponse.body.error.code).toBe('VALIDATION_ERROR');

        const missingTodoResponse = await request(app).put('/todos/missing-id').send({ title: 'Update' });

        expect(missingTodoResponse.status).toBe(404);
        expect(missingTodoResponse.body.error.code).toBe('NOT_FOUND');
    });
});
