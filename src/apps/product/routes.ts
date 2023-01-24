import { Router, Request, Response } from 'express';

import productController from './controllers';

import { checkAuth } from '../../shared/middleware';
import { successResponse } from '../../shared/utils';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const products = await productController.getAll();

    return res.send(successResponse({ data: products }));
});

router.get('/:productId', async (req: Request, res: Response) => {
    const product = await productController.getOne({ _id: req.params.productId });
    if (!product) {
        res.status(404);
        throw new Error('Product does not exists.');
    }

    return res.send(successResponse({ data: product }));
});

router.post('/', checkAuth, async (req: Request, res: Response) => {
    const productExists = await productController.exists({ name: req.body.name });
    if (productExists) {
        res.status(400);
        throw new Error('Product with same name already exists.');
    }

    const newProduct = await productController.create({ ...req.body });
    return res.send(successResponse({ data: newProduct.toObject() }));
});

export default router;
