import { NextFunction, Response } from 'express';

import { AuthRequest } from '../../common/types';
import { UserTodoPermissions } from '../../common/constants';
import permissionService from './permission.service';

export const checkPermission = async (
    permission: UserTodoPermissions,
    entityId: string,
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const isValid = !!Object.values(UserTodoPermissions).find((v) => v === permission);
    if (!isValid) {
        throw new Error('Invalid Permission Specified');
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
