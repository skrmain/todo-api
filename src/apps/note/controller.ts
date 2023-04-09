/* eslint-disable object-curly-newline */

import { NextFunction, Request, Response } from 'express';

import { successResponse } from '../../shared/utils';
import { UserTodoPermissions } from '../../shared/constants';

import todoService from './service';
import userNoteService from '../userNote/service';
import { parseUserTodos, parseUserTodo } from './parser';
import { AuthRequest } from '../../shared/types';

const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const todo = await todoService.create({ ...req.body, userId: req.user?._id });
        await userNoteService.create({
            userId: req.user?._id,
            todoId: todo._id,
            permissions: [...Object.values(UserTodoPermissions)],
            addedBy: req.user?._id,
        });
        res.send(successResponse({ data: { _id: todo._id } }));
    } catch (error) {
        next(error);
    }
};

const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { pageNumber, pageSize, sortOrder, sortBy, status, title } = req.query as any;
        const filter: any = {};

        if (status) {
            filter['todoId.status'] = status;
        }
        if (title) {
            filter['todoId.title'] = { $regex: new RegExp(title, 'i') };
        }

        const { todos, total } = await userNoteService.getUserTodos({ userId: req.user?._id, pageNumber, pageSize, sortOrder, sortBy, filter });
        const parsedTodos = parseUserTodos(todos);

        return res.send(successResponse({ data: parsedTodos, metadata: { pageNumber, pageSize, sortOrder, sortBy, total } }));
    } catch (error) {
        return next(error);
    }
};

const getOne = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const todo = await userNoteService.getOne({ todoId: req.params.todoId, userId: req.user?._id }, '-addedBy -userId').populate('todoId');
        return res.send(successResponse({ data: parseUserTodo(todo) }));
    } catch (error) {
        return next(error);
    }
};

const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await todoService.updateOne({ _id: req.params.todoId }, { ...req.body });
        return res.send(successResponse({ message: 'Updated' }));
    } catch (error) {
        return next(error);
    }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await todoService.deleteOne({ _id: req.params.todoId });
        await userNoteService.deleteMany({ todoId: req.params.todoId });
        return res.send(successResponse({ message: 'Successfully Deleted' }));
    } catch (error) {
        return next(error);
    }
};

const addUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user?._id.toString() === req.params.userId.toString()) {
            throw new Error('Invalid Operation');
        }
        const userTodo = await userNoteService.getOne({
            todoId: req.params.todoId,
            userId: req.params.userId,
        });
        if (userTodo) {
            await userNoteService.updateOne(
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
            await userNoteService.create({
                todoId: req.params.todoId,
                userId: req.params.userId,
                addedBy: req.user?._id,
                permissions: [...req.body.permissions],
            });
        }
        return res.send(successResponse({ message: 'Permissions Updated' }));
    } catch (error) {
        return next(error);
    }
};

const removeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userNoteService.deleteOne({
            todoId: req.params.todoId,
            userId: req.params.userId,
        });
        return res.send(successResponse({ message: 'User Successfully Removed' }));
    } catch (error) {
        return next(error);
    }
};

export default {
    create,
    getAll,
    getOne,
    updateOne,
    deleteOne,
    addUser,
    removeUser,
};
