import { Router } from 'express';

import { getAllOrders, getOrderDetails } from './controller';

const router = Router();

router.get('/', getAllOrders);
router.get('/:orderId', getOrderDetails);

export default router;
