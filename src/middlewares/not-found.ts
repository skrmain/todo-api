import type { RequestHandler } from 'express';
import { NotFoundError } from '../errors/app-error.js';

export const notFoundMiddleware: RequestHandler = () => {
    throw new NotFoundError('Not found');
};
