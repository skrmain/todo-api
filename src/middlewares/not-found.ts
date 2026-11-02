import { Request, Response, NextFunction } from 'express';
import { AppErrors, raise } from '../errors/index.js';

export function notFoundMiddleware(req: Request, _res: Response, _next: NextFunction): void {
    // throw new NotFoundHttpRequestError(`Invalid Path. This path does not Exists. '${req.path}'`);
    raise(AppErrors.NOT_FOUND, { message: `Route not found: ${req.method} ${req.originalUrl}` });
}
