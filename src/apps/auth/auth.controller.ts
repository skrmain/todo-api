import { Request, Response } from 'express';

import { successResponse } from '../../common/utils.js';
import authService from './auth.service.js';

export async function register(req: Request, res: Response) {
    await authService.register(req.body);
    return res.send(successResponse({ message: 'Registration successful' }));
}

export async function login(req: Request, res: Response) {
    const tokens = await authService.login(req.body);
    return res.send(successResponse({ message: 'Login Successful', data: tokens }));
}

export async function refreshAccessToken(req: Request, res: Response) {
    const token = await authService.refreshAccessToken(req.body.refresh);
    return res.send(successResponse({ data: { token } }));
}

export async function getAuthorizeUrl(_req: Request, res: Response) {
    const authorizeUrl = authService.getAuthorizeUrl();
    return res.send(successResponse({ data: { authorizeUrl } }));
}

export async function callback(req: Request, res: Response) {
    await authService.callback(req.query.code?.toString());
    return res.send(successResponse({ message: 'Success' }));
}
