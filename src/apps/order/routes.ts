import { Router, Response } from 'express';
import { AuthRequest } from '../../shared/types';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    // TODO: to get all orders
    return res.send({ message: 'NOT IMPLEMENTED' });
});

router.get('/:orderId', async (req: AuthRequest, res: Response) => {
    // TODO: to get a order detail
    return res.send({ message: 'NOT IMPLEMENTED' });
});

export default router;
