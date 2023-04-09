import { Response } from 'express';

import userService from './service';

import { AuthRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';

export const userDetails = async (req: AuthRequest, res: Response) => {
    const user = await userService.getOne({ email: req.user?.email || '' });
    return res.send(successResponse({ data: { user } }));
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
    const users = await userService.getAll({ name: { $regex: req.query.name } }, '-email -createdAt -updatedAt');
    return res.send(successResponse({ data: users }));
};

export const updateUserDetails = async (req: AuthRequest, res: Response) => {
    await userService.updateOne({ _id: req.user?._id }, { name: req.body.name });
    return res.send(successResponse({ message: 'Details Updated' }));
};

export const deleteUser = (req: AuthRequest, res: Response) => {
    // TODO:  To Start process for Deleting Account, OR Deactivate, OR HARD Delete
    return res.send({ message: 'NOT IMPLEMENTED' });
};
