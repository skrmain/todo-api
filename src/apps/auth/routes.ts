import { Router } from 'express';

import authController from './controller';

import { validateReqBody } from '../../shared/middleware';
import { LoginSchema, RegisterSchema, TokenRefreshSchema } from './validation';

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
router.post('/register', validateReqBody(RegisterSchema), authController.register);
router.post('/login', validateReqBody(LoginSchema), authController.login);
router.post('/token/refresh', validateReqBody(TokenRefreshSchema), authController.refreshAccessToken);
router.put('/forgot-password', authController.forgotPassword);
router.put('/set-password/:token', authController.setPassword);
router.put('/activate-account/:activationToken', authController.activateAccount);

export default router;
