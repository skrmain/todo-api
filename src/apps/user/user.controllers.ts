import { Response } from 'express';

import { AuthRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';

import userService from './user.service';

export const getUserDetails = async (req: AuthRequest, res: Response) => {
    const user = await userService.getOne({ email: req.user?.email || '' });
    return res.send(successResponse({ data: { user } }));
};

export const updateUserDetails = async (req: AuthRequest, res: Response) => {
    await userService.updateOne({ _id: req.user?._id }, { name: req.body.name });
    return res.send(successResponse({ message: 'Details Updated' }));
};
