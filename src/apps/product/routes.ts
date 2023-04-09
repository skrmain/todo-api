import { Router } from 'express';

import { addProduct, deleteProduct, getProduct, getProductImage, getProducts, removeProduct, saveProduct, updateProduct } from './controller';
import { checkAuth, handleFiles } from '../../shared/middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:productId', getProduct);
router.post('/', checkAuth, handleFiles, addProduct);
router.get('/:productId/images/:imageId/:imageName', getProductImage);
router.patch('/', checkAuth, updateProduct);
router.delete('/', checkAuth, deleteProduct);
router.put('/:productId/save', checkAuth, saveProduct);
router.delete('/:productId/save', checkAuth, removeProduct);
router.post('/add-sample-products', checkAuth);

export default router;
