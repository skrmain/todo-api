/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import formidable from 'formidable';

import { HttpError, InvalidHttpRequestError, NotFoundHttpRequestError, UnauthorizedHttpRequestError } from './custom-errors';
import { AuthRequest, User } from './types';
import { verifyToken } from './utils';

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
