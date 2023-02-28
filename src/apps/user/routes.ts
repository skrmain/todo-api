import { Router, Response } from 'express';

import userController from './controller';

import { AuthRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';
import { validateRequestBody } from '../../shared/middleware';
import { UserUpdateDetailValidator } from './validator';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    const user = await userController.getOne({ email: req.user?.email || '' });
    return res.send(successResponse({ data: { user } }));
});

router.patch('/', UserUpdateDetailValidator, validateRequestBody, async (req: AuthRequest, res: Response) => {
    await userController.updateOne({ _id: req.user?._id }, { name: req.body.name });
    return res.send(successResponse({ message: 'Details Updated' }));
});

router.delete('/', (req: AuthRequest, res: Response) => {
    // TODO:  To Start process for Deleting Account, OR Deactivate, OR HARD Delete
    return res.send({ message: 'NOT IMPLEMENTED' });
});

export default router;
