import { NextFunction, Request, Response, ErrorRequestHandler, json } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import Joi from 'joi';

import { HttpError, InvalidHttpRequestError, NotFoundHttpRequestError, UnauthorizedHttpRequestError } from './custom-errors';
import { MongooseOperationsWrapper } from './mongoose-operations-wrapper';
import { AuthRequest, User } from './types';
import { logger, verifyToken } from './utils';

export const requestErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    let statusCode = 500;
    let errorDetail;
    if (error instanceof HttpError) {
        statusCode = error.statusCode;
        errorDetail = error.errorDetail;
    } else if (error instanceof JsonWebTokenError) {
        const nError = new InvalidHttpRequestError('Invalid Token');
        statusCode = nError.statusCode;
        error.message = nError.message;
    } else if (error.bsonError && error instanceof Error) {
        const nError = new InvalidHttpRequestError('Invalid Request');
        statusCode = nError.statusCode;
        error.message = nError.message;
    } else if (error instanceof Joi.ValidationError) {
        statusCode = res.statusCode;
    } else {
        logger.error('⚠️  [Server] Error', { error: { message: error?.message, stack: error?.stack, ...error } });
    }
    return res.status(statusCode).send({ status: false, message: error.message, error: errorDetail });
};

export const invalidPathHandler = (req: Request, res: Response) => {
    throw new NotFoundHttpRequestError(`Invalid Path. This path does not Exists. '${req.path}'`);
};

export const exists = async (service: MongooseOperationsWrapper<any>, entityId: string, req: Request, res: Response, next: NextFunction) => {
    try {
        const isExist = await service.exists({ _id: entityId });
        if (isExist) {
            return next();
        }
        res.status(404);
        throw new InvalidHttpRequestError('Not Found.');
    } catch (error) {
        return next(error);
    }
};

export const validateReqBody = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.body);
    if (!error) {
        req.body = value;
        return next();
    }
    res.status(400);
    throw error;
};

export const validateReqQuery = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.query);
    if (!error) {
        req.query = value;
        return next();
    }
    res.status(400);
    throw error;
};

export const validateReqParams = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.params);
    if (!error) {
        // req.params = value;
        return next();
    }
    res.status(400);
    throw error;
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
