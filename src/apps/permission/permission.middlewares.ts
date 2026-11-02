import { NextFunction, Response } from 'express';

import permissionService from './permission.service.js';
import { AuthRequest } from '../../common/types.js';
import { Permissions } from './permission.models.js';
import { InvalidHttpRequestError } from '../../common/custom-errors.js';

type TodoRequest = AuthRequest<{ todoId: string }>;

export const checkPermission = async (permission: Permissions, entityId: string, req: AuthRequest, res: Response, next: NextFunction) => {
    const isValid = !!Object.values(Permissions).find((v) => v === permission);
    if (!isValid) {
        throw new InvalidHttpRequestError('Invalid Permission Specified');
    }
    try {
        const result = await permissionService.exists({
            userId: req.user?._id,
            entityId,
            permissions: { $in: [permission] },
        });

        if (result) {
            return next();
        }
        return res.send('Invalid Permission');
    } catch (error) {
        return next(error);
    }
};

export const checkEntityPermission =
    (permission: Permissions) => (req: TodoRequest, res: Response, next: NextFunction) =>
        checkPermission(permission, req.params.todoId, req, res, next);
