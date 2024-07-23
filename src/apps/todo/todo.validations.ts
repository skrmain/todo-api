import Joi from 'joi';

import { TodoStatus, UserTodoPermissions, SortOrder } from '../../common/constants';
import { ValidateObjectId } from '../../common/utils';
import { getPaginationParams, getSortingParams } from '../../common/common.validations';

export const TodoCreateUpdateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(20).required(),
    detail: Joi.string().trim().allow(''),
    status: Joi.string()
        .trim()
        .valid(...Object.values(TodoStatus)),
});

export const UserTodoPermissionSchema = Joi.object({
    permissions: Joi.array()
        .items(...Object.values(UserTodoPermissions))
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
