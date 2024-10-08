import { NextFunction, Response } from 'express';

import { AuthRequest } from '../../common/types';
import { Permissions } from './permission.models';

import permissionService from './permission.service';

export const checkPermission = async (permission: Permissions, entityId: string, req: AuthRequest, res: Response, next: NextFunction) => {
    const isValid = !!Object.values(Permissions).find((v) => v === permission);
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
