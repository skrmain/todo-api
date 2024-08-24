import { NextFunction, Response } from 'express';

import permissionService from './permission.service';

import { AuthRequest } from '../../common/types';
import { Permissions } from './permission.models';
import { InvalidHttpRequestError } from '../../common/custom-errors';

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
