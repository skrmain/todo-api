import Joi from 'joi';
import { SortOrder } from '../../shared/constants';

export const UpdateUserDetailSchema = Joi.object({
    name: Joi.string().trim().min(3).max(20).required(),
});

export const UsersQuerySchema = Joi.object({
    pageNumber: Joi.number().min(1).default(1),
    pageSize: Joi.number().min(1).max(100).default(10),
    sortOrder: Joi.string()
        .valid(...Object.values(SortOrder))
        .default(SortOrder.desc),
    sortBy: Joi.string()
        .valid(...['status', 'createdAt', 'updatedAt'])
        .default('updatedAt'),
    name: Joi.string().trim().required().lowercase(),
});
