/* eslint-disable object-curly-newline */
// eslint-disable-next-line no-unused-vars
const { Request, Response, NextFunction } = require('express');

const { successResponse } = require('../../shared/utils');
const { UserTodoPermissions } = require('../../shared/constants');

const todoService = require('./service');
const userTodoService = require('../userTodo/service');
const { parseUserTodos, parseUserTodo } = require('./parser');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const create = async (req, res, next) => {
    try {
        const todo = await todoService.create({ ...req.body, userId: req.user._id });
        await userTodoService.create({
            userId: req.user._id,
            todoId: todo._id,
            permissions: [...Object.values(UserTodoPermissions)],
            addedBy: req.user._id,
        });
        res.send(successResponse({ data: { _id: todo._id } }));
    } catch (error) {
        next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAll = async (req, res, next) => {
    try {
        const { pageNumber, pageSize, sortOrder, sortBy, status, title } = req.query;
        const filter = {};

        if (status) {
            filter['todoId.status'] = status;
        }
        if (title) {
            filter['todoId.title'] = { $regex: new RegExp(title, 'i') };
        }

        const { todos, total } = await userTodoService.getUserTodos({ userId: req.user._id, pageNumber, pageSize, sortOrder, sortBy, filter });
        const parsedTodos = parseUserTodos(todos);

        return res.send(successResponse({ data: parsedTodos, metadata: { pageNumber, pageSize, sortOrder, sortBy, total } }));
    } catch (error) {
        return next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getOne = async (req, res, next) => {
    try {
        const todo = await userTodoService.getOne({ todoId: req.params.todoId, userId: req.user._id }, '-addedBy -userId').populate('todoId');
        return res.send(successResponse({ data: parseUserTodo(todo) }));
    } catch (error) {
        return next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateOne = async (req, res, next) => {
    try {
        await todoService.updateOne({ _id: req.params.todoId }, { ...req.body });
        return res.send(successResponse({ message: 'Updated' }));
    } catch (error) {
        return next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteOne = async (req, res, next) => {
    try {
        await todoService.deleteOne({ _id: req.params.todoId });
        await userTodoService.deleteMany({ todoId: req.params.todoId });
        return res.send(successResponse({ message: 'Successfully Deleted' }));
    } catch (error) {
        return next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const addUser = async (req, res, next) => {
    try {
        if (req.user._id.toString() === req.params.userId.toString()) {
            throw new Error('Invalid Operation');
        }
        const userTodo = await userTodoService.getOne({
            todoId: req.params.todoId,
            userId: req.params.userId,
        });
        if (userTodo) {
            await userTodoService.updateOne(
                {
                    _id: userTodo._id,
                },
                {
                    $set: {
                        permissions: [...req.body.permissions],
                    },
                }
            );
        } else {
            await userTodoService.create({
                todoId: req.params.todoId,
                userId: req.params.userId,
                addedBy: req.user._id,
                permissions: [...req.body.permissions],
            });
        }
        return res.send(successResponse({ message: 'Permissions Updated' }));
    } catch (error) {
        return next(error);
    }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const removeUser = async (req, res, next) => {
    try {
        await userTodoService.deleteOne({
            todoId: req.params.todoId,
            userId: req.params.userId,
        });
        return res.send(successResponse({ message: 'User Successfully Removed' }));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    create,
    getAll,
    getOne,
    updateOne,
    deleteOne,
    addUser,
    removeUser,
};
