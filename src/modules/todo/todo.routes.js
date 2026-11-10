import express from 'express';

export function createTodoRouter(controller) {
    const router = express.Router();

    router.get('/', controller.list);
    router.post('/', controller.create);
    router.get('/:id', controller.get);
    router.put('/:id', controller.update);
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.delete);
    router.all('/', (req, res) => res.status(405).json({ error: 'Method not allowed' }));
    router.all('/:id', (req, res) => res.status(405).json({ error: 'Method not allowed' }));

    return router;
}
