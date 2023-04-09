/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import formidable from 'formidable';

import { HttpError, InvalidHttpRequestError, NotFoundHttpRequestError, UnauthorizedHttpRequestError } from './custom-errors';
import { AuthRequest, User } from './types';
import { verifyToken } from './utils';
import { UserTodoPermissions } from './constants';

import todoService from './../apps/note/service';
import userTodoService from './../apps/userNote/service';
import Joi from 'joi';

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        throw new UnauthorizedHttpRequestError('Authorization Token missing in headers');
    }
    const token = authorizationHeader.split('Bearer ')[1];
    req.user = <User>verifyToken(token);
    next();
};

export const validateRequestBody = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // TODO: check about handling this kind of error
        throw new InvalidHttpRequestError('Invalid request body', errors.array());
    }
    return next();
};

export const requestErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log('[error]', error);
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

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.url, res.statusCode);
    next();
};

const form = formidable({
    multiples: true,
    // NOTE: To store only images
    filter: ({ mimetype }) => (mimetype ? mimetype.includes('image') : false),
});

export const handleFiles = (req: Request, res: Response, next: NextFunction) => {
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw new Error(err);
        }

        // console.log('fil', fields);
        // console.log('files', files);
        req.body = { ...fields, ...files };
        next();
        // res.send('Ok');
    });
};

export const checkUserTodoPermission = (permission: any) => {
    const isValid = !!Object.values(UserTodoPermissions).find((v) => v === permission);
    if (!isValid) {
        throw new Error('Invalid Permission Specified');
    }
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const result = await userTodoService.exists({ userId: req.user?._id, todoId: req.params.todoId, permissions: { $in: [permission] } });
            // console.log('[result]', result);

            if (result) {
                return next();
            }
            return res.send('Invalid Permission');
        } catch (error) {
            return next(error);
        }
    };
};

export const checkTodoExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isExist = await todoService.exists({ _id: req.params.todoId });
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
