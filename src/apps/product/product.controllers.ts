import { FilterQuery } from 'mongoose';
import { readFile } from 'fs/promises';

import productService from './product.service';

import { IProduct, IProductImages } from './product.models';
import { IProductDetails, IProductIdParam, IProductQuery, IProductSaveDetails } from './product.types';
import { InvalidHttpRequestError, NotFoundHttpRequestError } from '../../shared/custom-errors';

import savedProductController from '../savedProduct/service';
import { Request, Response } from 'express';
import { successResponse } from '../../shared/utils';
import { AuthRequest } from '../../shared/types';
import { sampleProducts } from '../../shared/products.data';

export const getProducts = async (req: Request<unknown, unknown, unknown, IProductQuery | any>, res: Response) => {
    const {
        limit = 10,
        page = 1,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        category = '',
        brand = '',
    } = req.query;
    const filter: FilterQuery<IProduct> = {};

    if (search) {
        filter.name = { $regex: search };
    }
    if (category) {
        filter.category = category;
    }
    if (brand) {
        filter.brand = brand;
    }
    const products = await productService.getMany(filter, '', { limit, page, sortBy, sortOrder });
    const total = await productService.count(filter);

    return res.send(successResponse({ data: products, metadata: { page, limit, sortBy, sortOrder, total } }));
};

export const getProduct = async (req: Request<IProductIdParam>, res: Response) => {
    const data = await productService.getOne({ _id: req.params.productId });
    if (!data) {
        throw new NotFoundHttpRequestError("Product doesn't exists.");
    }
    return res.send(successResponse({ data }));
};

export const addProduct = async (req: AuthRequest<any, any, IProductDetails>, res: Response) => {
    const details = req.body;

    // TODO: add check if product is added by same user
    // TODO: add user type or role check
    const { name, brand, category, description, price, images: _images } = details;
    const productExists = await productService.exists({ name });
    if (productExists) {
        throw new InvalidHttpRequestError('Product with same name already exists.');
    }

    const images: IProductImages[] = [];

    // TODO: add logic to clear image from `/tmp`
    if (_images) {
        if (_images instanceof Array)
            for (const image of _images) {
                images.push({
                    name: image.originalFilename ?? '',
                    size: image.size,
                    mimetype: image.mimetype ?? '',
                    buffer: await readFile(image.filepath),
                });
            }
        else {
            images.push({
                name: _images.originalFilename ?? '',
                size: _images.size,
                mimetype: _images.mimetype ?? '',
                buffer: await readFile(_images.filepath),
            });
        }
    }

    const data = (
        await productService.create({ name, brand, category, description, price, images, userId: req.user?._id })
    ).toObject();

    return res.send(successResponse({ data }));
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    // TODO: add check if product is added by same user
    // TODO: add user type or role check
    // TODO: to update product details

    return res.send({ message: 'NOT IMPLEMENTED' });
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    // TODO: add check if product is added by same user
    // TODO: add user type or role check
    // TODO: to delete product -- check about possible way -- or mark product as archive and not show in product list

    return res.send({ message: 'NOT IMPLEMENTED' });
};

export const getProductImage = async (req: AuthRequest, res: Response) => {
    return res.send(successResponse({ data: req.params }));
};

export const saveProduct = async (req: AuthRequest, res: Response) => {
    const details: IProductSaveDetails = { productId: req.params.productId, userId: req.user?._id || '' };

    const { userId, productId } = details;
    const productExists = await productService.exists({ _id: productId });
    if (!productExists) {
        throw new NotFoundHttpRequestError("Product doesn't Exists");
    }

    const isSaved = await savedProductController.exists({ userId, productId });
    if (isSaved) {
        return false;
    }
    await savedProductController.create({ userId, productId });
    return res.send(successResponse({ message: 'Successfully Saved' }));
};

export const removeProduct = async (req: AuthRequest, res: Response) => {
    const details: IProductSaveDetails = { productId: req.params.productId, userId: req.user?._id || '' };

    const { userId, productId } = details;
    await savedProductController.deleteOne({ userId, productId });

    return res.send(successResponse({ message: 'Successfully Removed' }));
};

export const addSampleProducts = async (req: AuthRequest, res: Response) => {
    for (const product of sampleProducts) {
        const productExists = await productService.exists({ name: product.name });
        if (!productExists) {
            await productService.create({ ...product });
        }
    }
    return res.send(successResponse({}));
};
