import { Request, Response } from 'express';

import userService from './service';

import { AuthRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';

const getUserDetails = async (req: AuthRequest, res: Response) => {
    const user = await userService.getOne({ email: req.user?.email || '' });
    return res.send(successResponse({ data: { user } }));
};

const getUsers = async (req: Request, res: Response) => {
    const { name } = req.query as any;

    const users = await userService.getAll({ name: { $regex: new RegExp(name, 'i') } }, '-email -createdAt -updatedAt');
    return res.send(successResponse({ data: users }));
};

const updateUserDetails = async (req: AuthRequest, res: Response) => {
    await userService.updateOne({ _id: req.user?._id }, { name: req.body.name });
    return res.send(successResponse({ message: 'Details Updated' }));
};

const deleteUser = (req: AuthRequest, res: Response) => {
    // TODO:  To Start process for Deleting Account, OR Deactivate, OR HARD Delete
    return res.send({ message: 'NOT IMPLEMENTED' });
};

export default {
    getUserDetails,
    getUsers,
    updateUserDetails,
    deleteUser,
};
