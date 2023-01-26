import { Router, Request, Response } from 'express';

import userController from './../user/controller';

import { createToken, successResponse } from '../../shared/utils';
import { LoginBodyValidator, RegisterBodyValidator } from './validator';
import { validateRequestBody } from '../../shared/middleware';

const router = Router();

router.post('/register', RegisterBodyValidator, validateRequestBody, async (req: Request, res: Response) => {
    const existingUser = await userController.getOne({ email: req.body.email });
    if (existingUser) {
        res.status(400);
        throw new Error('Invalid Email');
    }

    await userController.create({ ...req.body });
    // TODO: send register mail with account activation link
    return res.send(successResponse({ message: 'Registration successful' }));
});

router.post('/login', LoginBodyValidator, validateRequestBody, async (req: Request, res: Response) => {
    // TODO: Add check in other routes if account is activated or nots
    const user = await userController.getOne({ ...req.body }, '-createdAt -updatedAt');
    if (!user) {
        throw new Error('Invalid Login Credentials');
    }

    const token = createToken(user);
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
