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
    return res.send(successResponse({ message: 'Registration successful' }));
});

router.post('/login', LoginBodyValidator, validateRequestBody, async (req: Request, res: Response) => {
    const user = await userController.getOne({ ...req.body }, '-createdAt -updatedAt');
    if (!user) {
        throw new Error('Invalid Login Credentials');
    }

    const token = createToken(user);
    return res.send(successResponse({ message: 'Login Successful', data: { token } }));
});

export default router;
