import Joi from 'joi';

export const RegisterSchema = Joi.object({
    name: Joi.string().trim().min(3).max(20).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().trim().min(5).max(20).required(),
});

export const LoginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().trim().min(5).max(20).required(),
});

export const TokenRefreshSchema = Joi.object({
    refresh: Joi.string().trim().required(),
});
