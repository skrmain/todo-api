import { Router, Response } from 'express';

import { AuthRequest } from '../../shared/types';
import savedProductController from './controllers';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    const data = await savedProductController.getAll({ userId: req.user?._id || '' });
    return res.send({ message: 'Fetched Successfully', data });
});

export default router;
