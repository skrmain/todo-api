import { Router } from 'express';

import { validateReqBody } from '../../common/middleware.js';
import { updateUser, getUser } from './user.controller.js';
import { UpdateUserDetailSchema } from './user.validations.js';

export const userRoutes = Router();

userRoutes.get('/', getUser);
userRoutes.patch('/', validateReqBody(UpdateUserDetailSchema), updateUser);
