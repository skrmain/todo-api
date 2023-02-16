import { Router, Response } from 'express';

import { AuthRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';
import orderController from './controllers';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    const data = await orderController
        .getAll({ userId: req.user?._id }, '-products._id -products.createdAt -products.updatedAt')
        .populate('products.productId');
    return res.send(successResponse({ message: 'Successfully Fetched', data }));
});

router.get('/:orderId', async (req: AuthRequest, res: Response) => {
    const data = await orderController
        .getOne({ _id: req.params.orderId }, '-products._id -products.createdAt -products.updatedAt')
        .populate('products.productId');

    if (!data) {
        res.status(404);
        throw new Error('Order does not exists.');
    }
    return res.send(successResponse({ message: 'Successfully fetched', data }));
});

export default router;
