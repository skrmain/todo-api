import Joi from 'joi';

const EmailSchema = Joi.string().trim().lowercase().email().required();
const PasswordSchema = Joi.string().trim().min(5).max(20).required();

export const RegisterSchema = Joi.object({
    name: Joi.string().trim().min(3).max(20).required(),
    email: EmailSchema,
    password: PasswordSchema,
});

export const LoginSchema = Joi.object({
    email: EmailSchema,
    password: PasswordSchema,
});

export const TokenRefreshSchema = Joi.object({
    refresh: Joi.string().trim().required(),
});
