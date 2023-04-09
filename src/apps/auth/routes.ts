import { Router } from 'express';

import { activateAccount, forgotPassword, login, refreshAccessToken, register, setPassword } from './controller';

import { LoginBodyValidator, RegisterBodyValidator, TokenRefreshValidator } from './validator';
import { validateRequestBody } from '../../shared/middleware';

const router = Router();

/**
 * @openapi
 * /register:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post('/register', RegisterBodyValidator, validateRequestBody, register);
router.post('/login', LoginBodyValidator, validateRequestBody, login);
router.post('/token/refresh', TokenRefreshValidator, refreshAccessToken);
router.put('/forgot-password', forgotPassword);
router.put('/set-password/:token', setPassword);
router.put('/activate-account/:activationToken', activateAccount);

export default router;
