import { Response } from 'express';
import { AuthRequest } from '../../shared/types';

import cartService from './service';
import productService from '../product/product.service';
import orderController from '../order/service';

import { InvalidHttpRequestError } from '../../shared/custom-errors';
import { successResponse } from '../../shared/utils';
import { Types } from 'mongoose';

export const getCart = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    // TODO: add info of total price of cart products
    const cart = await cartService
        .getOne(
            { userId },
            '-createdAt -updatedAt -userId -cartProducts._id -cartProducts.createdAt -cartProducts.updatedAt'
        )
        .populate('cartProducts.productId', 'name price brand');
    if (!cart) {
        throw new InvalidHttpRequestError('Please Create Cart First');
    }

    return res.send(successResponse({ data: cart }));
};

export const createCart = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const cartExists = await cartService.exists({ userId });

    if (cartExists) {
        throw new InvalidHttpRequestError('Cart already exists');
    }

    const newCart = await cartService.create({ userId });
    return res.send(successResponse({ data: newCart.toObject() }));
};

export const addProductToCart = async (req: AuthRequest, res: Response) => {
    // TODO: add limit of 10 product in cart
    // NOTE: to add product to cart
    const userId = req.user?._id;
    const { productId } = req.body;

    // 1. Check product exists
    const productExists = await productService.exists({ _id: productId });
    if (!productExists) {
        throw new InvalidHttpRequestError('Invalid Product');
    }

    // 2. Check for user cart exists
    const userCartExists = await cartService.exists({ userId });
    if (!userCartExists) {
        throw new InvalidHttpRequestError('Please Create Cart First');
    }

    // 3. Checking if Product is already available in cart
    const productExistsInCart = await cartService.exists({ userId, 'cartProducts.productId': productId });
    if (productExistsInCart) {
        await cartService.updateOne(
            { userId, 'cartProducts.productId': productId },
            { $inc: { 'cartProducts.$.quantity': 1 } }
        );
        return res.send(successResponse({ message: 'Updated Product Quantity' }));
    }
    // 4 - If Product is not available in cart
    await cartService.updateOne({ userId }, { $push: { cartProducts: { productId, quantity: 1 } } });
    return res.send(successResponse({ message: 'Added Product to Cart' }));
};

export const removeProductFromCart = async (req: AuthRequest, res: Response) => {
    // NOTE: to remove product from cart
    const userId = req.user?._id;
    const { productId } = req.params;

    const cartProduct = await cartService.getOne({ userId, 'products.productId': productId });
    if (!cartProduct) {
        throw new InvalidHttpRequestError('Product not in Cart');
    }
    const productQuantity = cartProduct.cartProducts[0].quantity;

    // 1. If product quantity in cart === 1
    if (productQuantity === 1) {
        await cartService.updateOne({ userId }, { $pull: { products: { productId } } });
        return res.send(successResponse({ message: 'Removed Product from Cart' }));
    }
    // 2. If product quantity in cart > 1
    await cartService.updateOne({ userId, 'products.productId': productId }, { $inc: { 'products.$.quantity': -1 } });
    return res.send(successResponse({ message: 'Decreased Product Quantity' }));
};

export const checkout = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id || '';
    const userCart = await cartService
        .getOne({ userId }, '-createdAt -updatedAt -products._id -products.createdAt -products.updatedAt')
        .populate('cartProducts.productId', 'name price brand');

    if (!userCart) {
        throw new InvalidHttpRequestError("Cart doesn't exists");
    }

    if (userCart.cartProducts.length === 0) {
        throw new InvalidHttpRequestError('Cart is Empty');
    }

    const productsInfo = userCart.cartProducts.map((product) => {
        if (product.productId == null || product.productId instanceof Types.ObjectId) {
            throw new Error('should be populated');
        }
        return {
            productId: product.productId._id,
            quantity: product.quantity,
            price: product.productId.price,
        };
    });

    await orderController.create({ userId, orderedProducts: productsInfo });
    await cartService.deleteOne({ userId });

    return res.send(successResponse({ message: 'Successfully Ordered' }));
};

export const clearCart = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const userCartExists = await cartService.exists({ userId });

    if (!userCartExists) {
        throw new Error('Cart does not exists');
    }

    await cartService.deleteOne({ userId });
    return res.send(successResponse({ message: 'Cart Emptied' }));
};
