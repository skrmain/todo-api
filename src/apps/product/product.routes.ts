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
} from './product.controllers';
import { checkAuth, handleFiles, validateReqBody, validateReqParams, validateReqQuery } from '../../shared/middleware';
import { ProductCreateSchema, ProductIdSchema, ProductQuerySchema } from './product.validations';

const router = Router();

router
    .route('/')
    .get(validateReqQuery(ProductQuerySchema), getProducts)
    .post(validateReqBody(ProductCreateSchema), checkAuth, handleFiles, addProduct);

router
    .route('/:productId')
    .all(validateReqParams(ProductIdSchema))
    .get(getProduct)
    .patch(checkAuth, updateProduct)
    .delete(checkAuth, deleteProduct);

router.get('/:productId/images/:imageId/:imageName', getProductImage);

// NOTE: have it here only, but if we have Model which is used for multiple Models then have in respective route file
// - like in case of otp-logs model -- that can be used for (user, business) {email, mobile}  verification
router.route('/:productId/save').all(checkAuth).put(saveProduct).delete(removeProduct);

router.post('/add-sample-products', checkAuth, addSampleProducts);

export default router;
