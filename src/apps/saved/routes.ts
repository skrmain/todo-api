import { Router, Response } from 'express';
import { AuthRequest } from '../../shared/types';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    // TODO: to get all saved products
    return res.send({ message: 'NOT IMPLEMENTED' });
});

export default router;
