import { Router } from 'express';

import {
    addProduct,
    addSampleProducts,
    deleteProduct,
    getProduct,
    getProductImage,
    getProducts,
    removeProduct,
    saveProduct,
    updateProduct,
} from './controller';
import { checkAuth, handleFiles } from '../../shared/middleware';

const router = Router();

router.route('/').get(getProducts).post(checkAuth, handleFiles, addProduct);

router.route('/:productId').get(getProduct).patch(checkAuth, updateProduct).delete(checkAuth, deleteProduct);
router.get('/:productId/images/:imageId/:imageName', getProductImage);

// NOTE: have it here only, but if we have Model which is used for multiple Models then have in respective route file
// - like in case of otp-logs model -- that can be used for (user, business) {email, mobile}  verification
router.route('/:productId/save').all(checkAuth).put(saveProduct).delete(removeProduct);

router.post('/add-sample-products', checkAuth, addSampleProducts);

export default router;
