import { Response } from 'express';
import { FilterQuery } from 'mongoose';

import { AuthRequest } from '../../shared/types';
import { IOrder } from './models';
import { getObjectId, successResponse } from '../../shared/utils';

import orderService from './service';

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    const { limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query as any;
    const filter: FilterQuery<IOrder> = { userId: getObjectId(req.user?._id) || '' };
    const totalCount = await orderService.count(filter);
    const data = await orderService
        .getWithQuery(
            filter,
            { limit, page, sortBy, sortOrder },
            '-userId -orderedProducts._id -orderedProducts.createdAt -orderedProducts.updatedAt'
        )
        .populate('orderedProducts.productId', '_id name');

    return res.send(successResponse({ message: 'Fetched Successfully', data, metadata: { page, limit, sortBy, sortOrder, total: totalCount } }));
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
    const data = await orderService
        .getOne({ _id: req.params.orderId }, '-products._id -products.createdAt -products.updatedAt')
        .populate('products.productId');

    if (!data) {
        res.status(404);
        throw new Error('Order does not exists.');
    }
    return res.send(successResponse({ message: 'Successfully fetched', data }));
};
