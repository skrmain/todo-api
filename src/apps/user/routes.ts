import { Router, Response } from 'express';

import userController from './controller';

import { AuthRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    const user = await userController.getOne({ email: req.user?.email || '' });
    if (!user) {
        throw new Error('Invalid Auth Token');
    }
    return res.send(successResponse({ data: { user } }));
});

router.patch('/', (req: AuthRequest, res: Response) => {
    // TODO: update user details
    return res.send({ message: 'NOT IMPLEMENTED' });
});

router.delete('/', (req: AuthRequest, res: Response) => {
    // TODO:  To Start process for Deleting Account, OR Deactivate, OR HARD Delete
    return res.send({ message: 'NOT IMPLEMENTED' });
});

export default router;
