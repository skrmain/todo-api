import { Router } from 'express';

import { validateRequestBody } from '../../shared/middleware';
import { CartAddBodyValidator } from './validator';
import { addProductToCart, checkout, clearCart, createCart, getCart, removeProductFromCart } from './controller';

const router = Router();

router.get('/', getCart);
router.post('/', createCart);
router.put('/', CartAddBodyValidator, validateRequestBody, addProductToCart);
router.delete('/products/:productId', removeProductFromCart);
router.post('/checkout', checkout);
router.delete('/', clearCart);

export default router;
