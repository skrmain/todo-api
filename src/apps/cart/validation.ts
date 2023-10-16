import Joi from 'joi';

// TODO: add validation for mongoDB ObjectId
export const AddProductInCartSchema = Joi.object({
    productId: Joi.string().trim().required(),
});
