import { Router } from 'express';
import { CartAddBodyValidator } from '../../shared/middleware';

import {
  AddProductToCartController,
  CartProductListController,
  EmptyCartController,
  RemoveProductFromCartController,
} from './controllers';

const router = Router();

router.get('/', CartProductListController);
router.post('/add', CartAddBodyValidator, AddProductToCartController);
router.post('/remove', RemoveProductFromCartController);
router.post('/empty', EmptyCartController);

export default router;
