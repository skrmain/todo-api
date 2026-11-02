import { Router } from 'express';

import { validateReqBody } from '../../common/middleware';
import { LoginSchema, RegisterSchema, TokenRefreshSchema } from './auth.validations';
import { callback, getAuthorizeUrl, login, refreshAccessToken, register } from './auth.controller';

export const authRoutes = Router();

authRoutes.post('/register', validateReqBody(RegisterSchema), register);
authRoutes.post('/login', validateReqBody(LoginSchema), login);
authRoutes.post('/token', validateReqBody(TokenRefreshSchema), refreshAccessToken);
authRoutes.get('/authorize-url', getAuthorizeUrl);
authRoutes.post('/callback', callback);
