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

export default router;
