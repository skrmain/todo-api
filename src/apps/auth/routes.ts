import { Router, Request, Response } from 'express';

import authController from './controllers';

import { successResponse } from '../../shared/utils';
import { LoginBodyValidator, RegisterBodyValidator } from './validator';
import { validateRequestBody } from '../../shared/middleware';

const router = Router();

router.post('/register', RegisterBodyValidator, validateRequestBody, async (req: Request, res: Response) => {
    await authController.registerUser(req.body);
    return res.send(successResponse({ message: 'Registration successful' }));
});

router.post('/login', LoginBodyValidator, validateRequestBody, async (req: Request, res: Response) => {
    const token = await authController.loginUser(req.body);
    return res.send(successResponse({ message: 'Login Successful', data: { token } }));
});

router.put('/forgot-password', (req: Request, res: Response) => {
    console.log('BODY ', req.body);
    // TODO: send email on email with password changed link, with min. expiry

    return res.send({ message: 'NOT IMPLEMENTED' });
});

router.put('/set-password/:token', (req: Request, res: Response) => {
    console.log('BODY ', req.body);
    // TODO: To set new password

    return res.send({ message: 'NOT IMPLEMENTED' });
});

router.put('/activate-account/:activationToken', (req: Request, res: Response) => {
    console.log('BODY ', req.body);
    // TODO: To Activate Account

    return res.send({ message: 'NOT IMPLEMENTED' });
});

export default router;
