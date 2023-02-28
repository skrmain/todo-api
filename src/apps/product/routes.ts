import { Router, Request, Response } from 'express';

import productController from './controllers';

import { checkAuth, handleFiles } from '../../shared/middleware';
import { successResponse } from '../../shared/utils';
import { AuthRequest } from '../../shared/types';
import { sampleProducts } from '../../shared/products.data';
import { IProductIdParam, IProductQuery } from './types';

const router = Router();

router.get('/', async (req: Request<unknown, unknown, unknown, IProductQuery>, res: Response) => {
    const data = await productController.getProducts(req.query);
    return res.send(successResponse({ ...data }));
});

router.get('/:productId', async (req: Request<IProductIdParam>, res: Response) => {
    const data = await productController.getProduct({ _id: req.params.productId });
    return res.send(successResponse({ data }));
});

router.post('/', checkAuth, handleFiles, async (req: AuthRequest, res: Response) => {
    const data = await productController.addProduct(req.body);
    return res.send(successResponse({ data }));
});

router.get('/:productId/images/:imageId/:imageName', async (req: AuthRequest, res: Response) => {
    const data = await productController.sendProductImage({ ...req.params });
    return res.send(successResponse({ data }));
});

router.patch('/', checkAuth, async (req: AuthRequest, res: Response) => {
    // TODO: add check if product is added by same user
    // TODO: add user type or role check
    // TODO: to update product details

    return res.send({ message: 'NOT IMPLEMENTED' });
});

router.delete('/', checkAuth, async (req: AuthRequest, res: Response) => {
    // TODO: add check if product is added by same user
    // TODO: add user type or role check
    // TODO: to delete product -- check about possible way -- or mark product as archive and not show in product list

    return res.send({ message: 'NOT IMPLEMENTED' });
});

router.put('/:productId/save', checkAuth, async (req: AuthRequest, res: Response) => {
    await productController.saveProduct({ productId: req.params.productId, userId: req.user?._id || '' });
    return res.send(successResponse({ message: 'Successfully Saved' }));
});

router.delete('/:productId/save', checkAuth, async (req: AuthRequest, res: Response) => {
    await productController.removeProduct({ productId: req.params.productId, userId: req.user?._id || '' });
    return res.send(successResponse({ message: 'Successfully Removed' }));
});

router.post('/add-sample-products', checkAuth, async (req: AuthRequest, res: Response) => {
    for (const product of sampleProducts) {
        const productExists = await productController.exists({ name: product.name });
        if (!productExists) {
            await productController.create({ ...product });
        }
    }
    return res.send(successResponse({}));
});

export default router;
