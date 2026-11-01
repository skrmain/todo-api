import { NextFunction, Request, Response } from 'express';

import todoService from './todo.service';
import permissionService from '../permission/permission.service';

import { exists } from '../../common/middleware';
import { AuthRequest } from '../../common/types';
import { successResponse } from '../../common/utils';
import { InvalidHttpRequestError } from '../../common/custom-errors';
import { checkPermission } from '../permission/permission.middlewares';
import { Permissions } from '../permission/permission.models';

export async function create(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const todo = await todoService.create({ ...req.body, userId });
    await permissionService.create({
        userId,
        entity: 'todo',
        entityId: todo._id,
        lastUpdatedBy: req.user?._id,
        permissions: [...Object.values(Permissions)],
    });
    return res.send(successResponse({ data: { _id: todo._id } }));
}

export async function getAll(req: AuthRequest, res: Response) {
    const { pageNumber, pageSize, sortOrder, sortBy, status, title } = req.query as any;
    const filter: any = {};

    if (status) {
        filter['todoId.status'] = status;
    }
    if (title) {
        filter['todoId.title'] = { $regex: new RegExp(title, 'i') };
    }

    const { todos, total } = await todoService.getUserTodos({
        userId: req.user?._id,
        pageNumber,
        pageSize,
        sortOrder,
        sortBy,
        filter,
    });
    const parsedTodos = todoService.parseUserTodos(todos);

    return res.send(successResponse({ data: parsedTodos, metadata: { pageNumber, pageSize, sortOrder, sortBy, total } }));
}

export async function getOne(req: AuthRequest, res: Response) {
    const todo = await todoService.getOne({ _id: req.params.todoId }, '-userId');
    const todoPermissions = await permissionService.getOne({ entityId: req.params.todoId, userId: req.user?._id });
    return res.send(successResponse({ data: todoService.parseUserTodo({ todoId: todo, permissions: todoPermissions?.permissions }) }));
}

export async function updateOne(req: Request, res: Response) {
    await todoService.updateOne({ _id: req.params.todoId }, { ...req.body });
    return res.send(successResponse({ message: 'Updated' }));
}

export async function deleteOne(req: Request, res: Response) {
    await todoService.deleteOne({ _id: req.params.todoId });
    await permissionService.deleteMany({ entityId: req.params.todoId });
    return res.send(successResponse({ message: 'Successfully Deleted' }));
}

export async function addUserToTodo(req: AuthRequest, res: Response) {
    if (req.user?._id.toString() === req.params.userId.toString()) {
        throw new InvalidHttpRequestError('Invalid Operation');
    }
    const userTodo = await permissionService.getOne({
        entityId: req.params.todoId,
        userId: req.params.userId,
    });
    if (userTodo) {
        await permissionService.updateOne({ _id: userTodo._id }, { $set: { permissions: [...req.body.permissions] } });
    } else {
        await permissionService.create({
            entityId: req.params.todoId,
            entity: 'todo',
            userId: req.params.userId,
            lastUpdatedBy: req.user?._id,
            permissions: [...req.body.permissions],
        });
    }
    return res.send(successResponse({ message: 'Permissions Updated' }));
}

export async function removeUserFromTodo(req: Request, res: Response) {
    await permissionService.deleteOne({ entityId: req.params.todoId, userId: req.params.userId });
    return res.send(successResponse({ message: 'User Successfully Removed' }));
}

export const todoExists = (req: Request, res: Response, next: NextFunction) => exists(todoService, req.params.todoId, req, res, next);

export const checkTodoPermission = (permission: Permissions) => (req: Request, res: Response, next: NextFunction) =>
    checkPermission(permission, req.params.todoId, req, res, next);
