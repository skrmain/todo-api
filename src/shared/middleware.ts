import { NextFunction, Request, Response, ErrorRequestHandler, json } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import formidable from 'formidable';
import Joi from 'joi';

import {
    HttpError,
    InvalidHttpRequestError,
    NotFoundHttpRequestError,
    UnauthorizedHttpRequestError,
} from './custom-errors';
import { AuthRequest, User } from './types';
import { verifyToken } from './utils';
import { UserNotePermissions } from './constants';

import noteService from '../apps/note/note.service';
import userNoteService from './../apps/userNote/service';
import logger from './logger';

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        throw new UnauthorizedHttpRequestError('Authorization Token missing in headers');
    }
    const token = authorizationHeader.split('Bearer ')[1];
    req.user = <User>verifyToken(token);
    next();
};

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
    // if (error instanceof MValidationError) {
    //     res.status(400);
    //     error.fullMessage = error.message;
    //     error.message = 'Invalid Input';
    // } else if (error instanceof JsonWebTokenError) {
    //     res.status(401);
    //     error.fullMessage = error.message;
    //     error.message = 'Invalid Token';
    // } else if (error instanceof MCastError) {
    //     res.status(400);
    //     error.fullMessage = error.message;
    //     error.message = 'Invalid Id';
    // }

    // const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    // console.log('[handleError] ', error.message);
    // return res.status(statusCode).send({ message: error.message, status: false });

    return res.status(statusCode).send({ status: false, message: error.message, error: errorDetail });
};

export const invalidPathHandler = (req: Request, res: Response) => {
    throw new NotFoundHttpRequestError(`Invalid Path. This path does not Exists. '${req.path}'`);
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

        req.body = { ...fields, ...files };
        next();
    });
};

export const checkUserNotePermission = (permission: any) => {
    const isValid = !!Object.values(UserNotePermissions).find((v) => v === permission);
    if (!isValid) {
        throw new Error('Invalid Permission Specified');
    }
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const result = await userNoteService.exists({
                userId: req.user?._id,
                noteId: req.params.noteId,
                permissions: { $in: [permission] },
            });

            if (result) {
                return next();
            }
            return res.send('Invalid Permission');
        } catch (error) {
            return next(error);
        }
    };
};

export const checkNoteExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isExist = await noteService.exists({ _id: req.params.noteId });
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
        req.params = value;
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
