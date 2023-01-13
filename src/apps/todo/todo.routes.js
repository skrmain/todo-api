const { Router } = require('express');

const middleware = require('../../shared/middleware');
const utils = require('../../shared/utils');
const todoValidation = require('./todo.validation');
const todoController = require('./todo.controller');

const router = Router();

router.post('/', middleware.validateReqBody(todoValidation.VTodoCreateUpdateSchema), async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            res.status(401);
            throw new Error('Login Required');
        }
        const todo = await todoController.create({ ...req.body, userId: req.user._id });
        res.send(utils.successResponse({ data: { _id: todo._id } }));
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const todos = await todoController.getAll({ userId: req.user._id }, '-userId');
        return res.send(utils.successResponse({ data: todos }));
    } catch (error) {
        return next(error);
    }
});

router.get('/:todoId', async (req, res, next) => {
    try {
        const todo = await todoController.getOne({ _id: req.params.todoId, userId: req.user._id });
        if (!todo) {
            res.status(404);
            throw new Error('Does not exists.');
        }
        return res.send(utils.successResponse({ data: todo }));
    } catch (error) {
        return next(error);
    }
});

router.patch('/:todoId', middleware.validateReqBody(todoValidation.VTodoCreateUpdateSchema), async (req, res, next) => {
    try {
        const result = await todoController.updateOne({ _id: req.params.todoId, userId: req.user._id }, { ...req.body });
        if (result.modifiedCount === 0) {
            res.status(404);
            throw new Error('Does not exists.');
        }
        return res.send(utils.successResponse({ message: 'Updated' }));
    } catch (error) {
        return next(error);
    }
});

router.delete('/:todoId', async (req, res, next) => {
    try {
        const result = await todoController.deleteOne({ _id: req.params.todoId, userId: req.user._id });
        if (result.deletedCount === 0) {
            res.status(404);
            throw new Error('Does not exists.');
        }
        return res.send(utils.successResponse({ message: 'Successfully Deleted' }));
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
