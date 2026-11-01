import { Request, Response, NextFunction } from 'express';
import { NotFoundHttpRequestError } from '../common/custom-errors.js';

export function notFoundMiddleware(req: Request, _res: Response, _next: NextFunction): void {
    throw new NotFoundHttpRequestError(`Invalid Path. This path does not Exists. '${req.path}'`);
}
