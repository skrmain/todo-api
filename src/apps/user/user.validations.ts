import Joi from 'joi';

import { SortOrder } from '../../shared/constants';
import { ValidateObjectId } from '../../shared/utils';
import { getPaginationParams, getSortingParams } from '../../shared/common.validations';

export const UserCreateSchema = Joi.object({
    name: Joi.string().trim().min(3).max(20).required(),
});

export const UpdateUserDetailSchema = Joi.object({
    name: Joi.string().trim().min(3).max(20).required(),
});

export const UsersQuerySchema = Joi.object({
    ...getPaginationParams(),
    ...getSortingParams(['status']),
    name: Joi.string().trim().required().lowercase(),
});

export const UserIdSchema = Joi.object({
    userId: Joi.string().custom(ValidateObjectId),
});
