import { NextFunction, Response } from 'express';

import { InvalidHttpRequestError } from '../../errors/custom-errors.js';
import { AuthRequest } from '../../common/types.js';
import todoService from './todo.service.js';

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
