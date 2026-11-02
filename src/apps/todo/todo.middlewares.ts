import { NextFunction, Response } from 'express';

import { InvalidHttpRequestError } from '../../common/custom-errors';
import { AuthRequest } from '../../common/types';
import todoService from './todo.service';

type TodoRequest = AuthRequest<{ todoId: string }>;

export async function todoExists(req: TodoRequest, res: Response, next: NextFunction) {
    try {
        const isExist = await todoService.exists(req.params.todoId);
        if (isExist) {
            return next();
        }
        res.status(404);
        throw new InvalidHttpRequestError('Not Found.');
    } catch (error) {
        return next(error);
    }
}
