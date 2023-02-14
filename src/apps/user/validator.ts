import { body } from 'express-validator';

// prettier-ignore
export const UserUpdateDetailValidator = [
    body('name').trim().exists({ checkNull: true, checkFalsy: true }),
];
