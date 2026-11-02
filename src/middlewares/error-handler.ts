import { NextFunction, Request, Response } from 'express';

import { HttpError, HttpStatus, InvalidHttpRequestError } from '../errors/custom-errors.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export function errorHandlerMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
    if (typeof error === 'object' && error !== null && 'type' in error) {
        if (error.type === 'entity.parse.failed') {
            res.status(HttpStatus.BadRequest).send({ message: 'Malformed JSON request body.' });
            return;
        }
        if (error.type === 'entity.too.large') {
            res.status(HttpStatus.PayloadTooLarge).send({ message: 'Request body is too large.' });
            return;
        }
    }

    let statusCode = HttpStatus.InternalServerError;
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';

    if (error instanceof HttpError) {
        statusCode = error.statusCode;
        errorMessage = errorMessage ?? error.errorDetail;
    } else if (error instanceof jwt.JsonWebTokenError) {
        const nError = new InvalidHttpRequestError('Invalid Token');
        statusCode = nError.statusCode;
        error.message = nError.message;
    } else if (error instanceof z.ZodError) {
        statusCode = res.statusCode;
    } else {
        console.error('⚠️  [Server] Error', { error: { message: (error as any)?.message, stack: (error as any)?.stack, ...(error as any) } });
    }

    res.status(statusCode).send({ message: errorMessage });
}
