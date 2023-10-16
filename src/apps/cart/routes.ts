import { Router } from 'express';

import { AddProductInCartSchema } from './validation';
import { addProductToCart, checkout, clearCart, createCart, getCart, removeProductFromCart } from './controller';
import { validateReqBody } from '../../shared/middleware';

const router = Router();

router
    .route('/my')
    .get(getCart)
    .post(createCart)
    .put(validateReqBody(AddProductInCartSchema), addProductToCart)
    .delete(clearCart);

router.delete('/my/products/:productId', removeProductFromCart);
router.post('/my/checkout', checkout);

export default router;
