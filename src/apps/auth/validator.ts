import { body } from 'express-validator';

export const RegisterBodyValidator = [
    body('name').trim().exists({ checkNull: true, checkFalsy: true }),
    body('email').isEmail().normalizeEmail(),
    body('password').trim().exists({ checkNull: true, checkFalsy: true }),
];

// prettier-ignore
export const LoginBodyValidator = [
    body('email').isEmail().normalizeEmail(),
    body('password').trim().exists({ checkNull: true, checkFalsy: true }),
];

// prettier-ignore
export const TokenRefreshValidator = [
    body('refresh').trim().exists({checkNull: true}),
];
