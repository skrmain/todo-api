import { Router } from 'express';

import { validateReqBody } from '../../common/middleware';
import { updateUser, getUser } from './user.controller';
import { UpdateUserDetailSchema } from './user.validations';

export const userRoutes = Router();

userRoutes.get('/', getUser);
userRoutes.patch('/', validateReqBody(UpdateUserDetailSchema), updateUser);
