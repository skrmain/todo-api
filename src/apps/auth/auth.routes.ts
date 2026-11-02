import { Router } from 'express';

import { validateReqBody } from '../../common/middleware.js';
import { LoginSchema, RegisterSchema, TokenRefreshSchema } from './auth.validations.js';
import { callback, getAuthorizeUrl, login, refreshAccessToken, register } from './auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/register', validateReqBody(RegisterSchema), register);
authRoutes.post('/login', validateReqBody(LoginSchema), login);
authRoutes.post('/token', validateReqBody(TokenRefreshSchema), refreshAccessToken);
authRoutes.get('/authorize-url', getAuthorizeUrl);
authRoutes.post('/callback', callback);
