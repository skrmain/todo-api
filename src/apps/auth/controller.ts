import { Request, Response } from 'express';

import userService from '../user/service';

import { InvalidHttpRequestError, UnauthorizedHttpRequestError } from '../../shared/custom-errors';
import { ILoginBody, IRegisterBody } from './types';
import { createToken, successResponse } from '../../shared/utils';

export const register = async (req: Request<any, any, IRegisterBody>, res: Response) => {
    const details = req.body;
    const existingUser = await userService.getOne({ email: details.email });
    if (existingUser) {
        throw new InvalidHttpRequestError('Invalid Email');
    }

    await userService.create({ ...details });
    // TODO: send register mail with account activation link
    return res.send(successResponse({ message: 'Registration successful' }));
};

export const login = async (req: Request<any, any, ILoginBody>, res: Response) => {
    const details = req.body;

    // TODO: Add check in other routes if account is activated or nots
    const user = await userService.getOne({ ...details }, '-createdAt -updatedAt');
    if (!user) {
        throw new UnauthorizedHttpRequestError('Invalid Login Credentials');
    }

    const token = createToken(user);
    return res.send(successResponse({ message: 'Login Successful', data: { token } }));
};

export const forgotPassword = (req: Request, res: Response) => {
    console.log('BODY ', req.body);
    // TODO: send email on email with password changed link, with min. expiry

    return res.send({ message: 'NOT IMPLEMENTED' });
};

export const setPassword = (req: Request, res: Response) => {
    console.log('BODY ', req.body);
    // TODO: To set new password

    return res.send({ message: 'NOT IMPLEMENTED' });
};

export const activateAccount = (req: Request, res: Response) => {
    console.log('BODY ', req.body);
    // TODO: To Activate Account

    return res.send({ message: 'NOT IMPLEMENTED' });
};
