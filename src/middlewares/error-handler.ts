import type { ErrorRequestHandler } from 'express';
import { z } from 'zod';

import { AppError } from '../errors/app-error.js';

function isBodyParsingError(error: unknown): error is { status: number; type: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        typeof error.status === 'number' &&
        'type' in error &&
        typeof error.type === 'string'
    );
}

export const errorHandlerMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
    const isDataParsingError = isBodyParsingError(error);
    if (isDataParsingError && error.status === 400 && error.type === 'entity.parse.failed') {
        res.status(error.status).json({
            error: {
                code: 'INVALID_JSON',
                message: 'Request body contains invalid JSON.',
                details: {},
            },
        });
        return;
    }
    if (isDataParsingError && error.status === 413 && error.type === 'entity.too.large') {
        res.status(error.status).json({
            error: {
                code: 'PAYLOAD_TOO_LARGE',
                message: 'Request body is too large.',
                details: {},
            },
        });
        return;
    }

    if (error instanceof AppError) {
        if (error.statusCode === 503) {
            res.setHeader('Retry-After', String(error.details.retryAfterSeconds ?? 1));
        }
        res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
            },
        });
        return;
    }

    if (error instanceof z.ZodError) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Request validation failed.',
                details: { issues: error.issues },
            },
        });
        return;
    }

    console.error('Unhandled request error:', error);
    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
            details: {},
        },
    });
};
