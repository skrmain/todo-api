import { body } from 'express-validator';

export const CartAddBodyValidator = [body('productId').trim().exists({ checkNull: true, checkFalsy: true })];
