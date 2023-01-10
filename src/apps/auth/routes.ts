import { sign } from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import config from '../../config';

import { LoginBodyValidator, RegisterBodyValidator } from '../../shared/middleware';
import { LoginModel, RegisterModel } from '../../shared/types';
import { sendFailResponse, sendSuccessResponse } from '../../shared/utils';
import { User as UserModal } from '../user/modals';

const router = Router();

router.post('/register', RegisterBodyValidator, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { name, email, password } = req.body as RegisterModel;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Registration Failed' });
    }

    const isEmailRegistered = (await UserModal.find({ email })).length > 0;

    if (isEmailRegistered) {
      throw new Error('Email Already Registered');
    }

    await UserModal.create({ name, email, password });
    sendSuccessResponse(res, {
      message: 'Registration successful',
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: 'Registration Failed',
    });
  }
});

router.post('/login', LoginBodyValidator, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Login Failed' });
    }

    const { email, password } = req.body as LoginModel;

    const userData = await UserModal.findOne(
      { email, password },
      {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    );

    if (!userData) {
      throw new Error('Invalid Login Credentials');
    }

    const token = sign(userData.toObject(), config.jwt_secret);
    sendSuccessResponse(res, {
      message: 'Login Successful',
      data: { user: userData, token },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: 'Login Failed',
    });
  }
});

export default router;
