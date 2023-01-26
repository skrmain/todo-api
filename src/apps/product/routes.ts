import { Router, Request, Response } from 'express';

import productController from './controllers';

import { checkAuth } from '../../shared/middleware';
import { successResponse } from '../../shared/utils';
import { AuthRequest } from '../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    // TODO: add pagination, sorting, filter, search
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

router.post('/', checkAuth, async (req: AuthRequest, res: Response) => {
    // TODO: add check if product is added by same user
    // TODO: add user type or role check
    const productExists = await productController.exists({ name: req.body.name });
    if (productExists) {
        res.status(400);
        throw new Error('Product with same name already exists.');
    }

    const newProduct = await productController.create({ ...req.body });
    return res.send(successResponse({ data: newProduct.toObject() }));
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

router.put('/:productId/save', (req: AuthRequest, res: Response) => {
    // TODO: create saved-products model
    // TODO: To Save Product to saved products
    return res.send({ message: 'NOT IMPLEMENTED' });
});

router.delete('/:productId/save', (req: AuthRequest, res: Response) => {
    // TODO: To remove Product from saved products
    return res.send({ message: 'NOT IMPLEMENTED' });
});

export default router;
