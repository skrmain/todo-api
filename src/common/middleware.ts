import { NextFunction, Request, Response, ErrorRequestHandler, json } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import Joi from 'joi';

import { HttpError, InvalidHttpRequestError, NotFoundHttpRequestError } from './custom-errors';
import logger from './logger';
import { MongooseOperationsWrapper } from './mongoose-operations-wrapper';

export const requestErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    logger.error('[error] - requestErrorHandler', { error });
    let statusCode = res.statusCode < 400 ? 500 : res.statusCode;
    let errorDetail;
    if (error instanceof HttpError) {
        statusCode = error.status;
        errorDetail = error.errorDetail;
    } else if (error instanceof JsonWebTokenError) {
        const nError = new InvalidHttpRequestError('Invalid Token');
        statusCode = nError.status;
        error.message = nError.message;
    }
    return res.status(statusCode).send({ status: false, message: error.message, error: errorDetail });
};

export const invalidPathHandler = (req: Request, res: Response) => {
    throw new NotFoundHttpRequestError(`Invalid Path. This path does not Exists. '${req.path}'`);
};

export const exists = async (
    service: MongooseOperationsWrapper<any>,
    entityId: string,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const isExist = await service.exists({ _id: entityId });
        if (isExist) {
            return next();
        }
        res.status(404);
        throw new Error('Does not exists.');
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
