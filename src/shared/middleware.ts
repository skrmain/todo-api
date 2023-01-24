/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { AuthRequest, User } from './types';
import { verifyToken } from './utils';

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
        res.status(400);
        // TODO: check about handling this kind of error
        throw new Error(JSON.stringify(errors.array()));
    }
    return next();
};

export const requestErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log('[error]', error.message);
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
    return res.status(statusCode).send({ status: false, message: error.message });
};

export const invalidPathHandler = (req: Request, res: Response) => {
    res.status(404);
    throw new Error(`Invalid Path. This path does not Exists. '${req.path}'`);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.url, res.statusCode);
    next();
};
