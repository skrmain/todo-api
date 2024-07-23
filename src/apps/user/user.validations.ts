import Joi from 'joi';

export const UpdateUserDetailSchema = Joi.object({
    name: Joi.string().trim().min(3).max(20).required(),
});
