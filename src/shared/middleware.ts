/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';

import { AuthRequest, User } from './types';
import { verifyToken } from './utils';

export const CartAddBodyValidator = [body('product').trim().exists({ checkNull: true, checkFalsy: true })];

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        res.status(401);
        throw new Error('Authorization Token missing in headers');
    }
    const token = authorizationHeader.split('Bearer ')[1];
    req.user = <User>verifyToken(token);
    next();
};

export const validateRequestBody = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Registration Failed' });
    }
    return next();
};

export const requestErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log('[error]', error.message);
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
    res.status(statusCode).send({ status: false, message: error.message });
    return 0;
};

export const invalidPathHandler = (req: Request, res: Response) => {
    console.log('[invalidPath] Invalid Path :', req.path);
    res.status(404).send({ message: 'Invalid Path. This path does not Exists' });
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.url, res.statusCode);
    next();
};
