import { Response } from 'express';

import { AuthRequest } from '../../common/types';
import { successResponse } from '../../common/utils';
import userService from './user.service';

export async function getUser(req: AuthRequest, res: Response) {
    const user = await userService.getOne({ email: req.user?.email || '' });
    return res.send(successResponse({ data: userService.parseUser(user) }));
}

export async function updateUser(req: AuthRequest, res: Response) {
    await userService.updateOne({ _id: req.user?._id }, { name: req.body.name });
    return res.send(successResponse({ message: 'Details Updated' }));
}
