import Joi from 'joi';

import { ValidateObjectId } from '../../common/utils';
import { TodoStatus } from './todo.models';
import { Permissions } from '../permission/permission.models';
import { SortOrder } from '../../common/types';

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

export const TodoCreateUpdateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(20).required(),
    detail: Joi.string().trim().allow(''),
    status: Joi.string()
        .trim()
        .valid(...Object.values(TodoStatus)),
});

export const UserTodoPermissionSchema = Joi.object({
    permissions: Joi.array()
        .items(...Object.values(Permissions))
        .required()
        .min(1),
});

export const TodoQuerySchema = Joi.object({
    ...getPaginationParams(),
    ...getSortingParams(['status']),
    status: Joi.string().valid(...Object.values(TodoStatus)),
    title: Joi.string(),
});

export const TodoIdSchema = Joi.object({
    todoId: Joi.string().custom(ValidateObjectId),
});
