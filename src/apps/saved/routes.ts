import { Router, Response } from 'express';
import { FilterQuery, PipelineStage } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { AuthRequest } from '../../shared/types';
import { getObjectId, successResponse } from '../../shared/utils';
import savedProductController from './controllers';
import { ISavedProduct } from './models';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
    // TODO: add search saved products by name
    const { limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query as any;
    const filter: FilterQuery<ISavedProduct> = { userId: getObjectId(req.user?._id) || '' };
    const pipeline: PipelineStage[] = [
        {
            $match: filter,
        },
        // TODO: make use of SortOrder enum
        { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) },
        {
            $lookup: {
                from: dbCollections.product,
                localField: 'productId',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: {
                path: '$product',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                // TODO: Explore do we need to have product detail nested or out
                __v: 0,
                _id: 0,
                userId: 0,
                productId: 0,
                'product.__v': 0,
                'product.createdAt': 0,
                'product.updatedAt': 0,
                'product.description': 0,
            },
        },
    ];

    const data = await savedProductController.aggregate(pipeline);
    const total = await savedProductController.count(filter);
    return res.send(successResponse({ message: 'Fetched Successfully', data, metaData: { page, limit, sortBy, sortOrder, total } }));
});

export default router;
