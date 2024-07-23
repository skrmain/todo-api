import Joi from 'joi';

import { SortOrder } from './constants';

export const getPaginationParams = () => ({
    pageNumber: Joi.number().min(1).default(1),
    pageSize: Joi.number().min(1).max(100).default(10),
});

export const getSortingParams = (sortByParams: string[]) => ({
    sortOrder: Joi.string()
        .valid(...Object.values(SortOrder))
        .default(SortOrder.desc),
    sortBy: Joi.string()
        .valid(...['createdAt', 'updatedAt', ...sortByParams])
        .default('updatedAt'),
});
