import { Router, Response } from 'express';

import cartController from './controllers';
import productController from './../product/controllers';

import { AuthRequest } from '../../shared/types';
import { successResponse } from '../../shared/utils';
import { validateRequestBody } from '../../shared/middleware';
import { CartAddBodyValidator } from './validator';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new Error('Login Required');
    }

    const cart = await cartController
        .getOne({ userId }, '-createdAt -updatedAt -products._id -products.createdAt -products.updatedAt')
        .populate('products.productId', 'name price brand');
    if (!cart) {
        throw new Error('Please Create Cart First');
    }
    return res.send(successResponse({ data: cart }));
});

router.post('/', async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new Error('Login Required');
    }

    const cartExists = await cartController.exists({ userId });
    if (cartExists) {
        throw new Error('Cart already exists');
    }

    const newCart = await cartController.create({ userId });
    return res.send(successResponse({ data: newCart.toObject() }));
});

router.post('/add', CartAddBodyValidator, validateRequestBody, async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new Error('Login Required');
    }
    const { productId } = req.body;

    // 1. Check product exists
    const productExists = await productController.exists({ _id: productId });
    if (!productExists) {
        throw new Error('Invalid Product');
    }

    // 2. Check for user cart exists
    const userCartExists = await cartController.exists({ userId });
    if (!userCartExists) {
        throw new Error('Please Create Cart First');
    }

    // 3. Checking if Product is already available in cart
    const productExistsInCart = await cartController.exists({ userId, 'products.productId': productId });
    if (productExistsInCart) {
        await cartController.updateOne({ userId, 'products.productId': productId }, { $inc: { 'products.$.quantity': 1 } });
        return res.send(successResponse({ message: 'Updated Product Quantity' }));
    }
    // 4 - If Product is not available in cart
    await cartController.updateOne({ userId }, { $push: { products: { productId, quantity: 1 } } });
    return res.send(successResponse({ message: 'Added Product to Cart' }));
});

router.post('/remove', CartAddBodyValidator, validateRequestBody, async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new Error('Login Required');
    }
    const { productId } = req.body;

    const cartProduct = await cartController.getOne({ userId, 'products.productId': productId });
    if (!cartProduct) {
        throw new Error('Product not in Cart');
    }
    const productQuantity = cartProduct.products[0].quantity;

    // 1. If product quantity in cart === 1
    if (productQuantity === 1) {
        await cartController.updateOne({ userId }, { $pull: { products: { productId } } });
        return res.send(successResponse({ message: 'Removed Product from Cart' }));
    }
    // 2. If product quantity in cart > 1
    await cartController.updateOne({ userId, 'products.productId': productId }, { $inc: { 'products.$.quantity': -1 } });
    return res.send(successResponse({ message: 'Decreased Product Quantity' }));
});

router.delete('/', async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new Error('Login Required');
    }

    const userCartExists = await cartController.exists({ userId });
    if (!userCartExists) {
        throw new Error('Cart does not exists');
    }

    await cartController.deleteOne({ userId });
    return res.send(successResponse({ message: 'Cart Emptied' }));
});

export default router;
