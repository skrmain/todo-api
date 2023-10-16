import Joi from 'joi';

import { ValidateObjectId } from '../../shared/utils';
import { getPaginationParams, getSortingParams } from '../../shared/common.validations';

export const ProductIdSchema = Joi.object({
    productId: Joi.string().custom(ValidateObjectId),
});

export const ProductCreateSchema = Joi.object({
    name: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    description: Joi.string().trim(),
    price: Joi.number(),
    images: Joi.any(),
});

export const ProductQuerySchema = Joi.object({
    ...getPaginationParams(),
    ...getSortingParams([]),
    name: Joi.string().trim().required().lowercase(),
});
