import { NextFunction, Request, Response, json } from 'express';
import { z } from 'zod';

import { UnauthorizedHttpRequestError } from '../errors/custom-errors.js';
import { AuthRequest, User } from './types.js';
import { verifyToken } from './utils.js';

export const validateReqBody = (schema: z.ZodType<any>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
        req.body = result.data;
        return next();
    }
    res.status(400);
    throw result.error;
};

export const validateReqQuery = (schema: z.ZodType<any>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (result.success) {
        req.query = result.data;
        return next();
    }
    res.status(400);
    throw result.error;
};

export const validateReqParams = (schema: z.ZodType<any>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (result.success) {
        // req.params = value;
        return next();
    }
    res.status(400);
    throw result.error;
};

export const parseJson = (req: Request, res: Response, next: NextFunction) => {
    json()(req, res, (error) => {
        if (!error) {
            return next();
        }
        res.status(400);
        error.fullMessage = error.message;
        error.message = 'Invalid data format.';
        return next(error);
    });
};

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        throw new UnauthorizedHttpRequestError('Authorization Token missing in headers');
    }
    const token = authorizationHeader.split('Bearer ')[1];
    req.user = <User>verifyToken(token);
    next();
};
