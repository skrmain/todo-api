import { Request, Response } from 'express';

import { AuthRequest } from '../../common/types.js';
import { successResponse } from '../../common/utils.js';
import todoService from './todo.service.js';

type TodoRequest = AuthRequest<{ todoId: string }>;
type TodoListQuery = {
    pageNumber: number;
    pageSize: number;
    sortOrder: string;
    sortBy: string;
    status?: string;
    title?: string;
};

export async function createTodo(req: AuthRequest, res: Response) {
    const todo = await todoService.create(req.body, req.user?._id);
    return res.send(successResponse({ data: { _id: todo._id } }));
}

export async function getAll(req: AuthRequest, res: Response) {
    const { pageNumber, pageSize, sortOrder, sortBy, status, title } = req.query as unknown as TodoListQuery;
    const { todos, total } = await todoService.getUserTodos({
        userId: req.user?._id,
        pageNumber,
        pageSize,
        sortOrder,
        sortBy,
        status,
        title,
    });

    return res.send(
        successResponse({
            data: todos,
            metadata: { pageNumber, pageSize, sortOrder, sortBy, total },
        }),
    );
}

export async function getOne(req: TodoRequest, res: Response) {
    const todo = await todoService.getOne(req.params.todoId, req.user?._id);
    return res.send(successResponse({ data: todo }));
}

export async function updateOne(req: Request<{ todoId: string }>, res: Response) {
    await todoService.update(req.params.todoId, req.body);
    return res.send(successResponse({ message: 'Updated' }));
}

export async function deleteOne(req: Request<{ todoId: string }>, res: Response) {
    await todoService.delete(req.params.todoId);
    return res.send(successResponse({ message: 'Successfully Deleted' }));
}
