import { Router } from 'express';

import { createUser, deleteUser, getUserDetails, getUsers, updateUserDetails } from './user.controllers';
import { validateReqBody, validateReqParams, validateReqQuery } from '../../shared/middleware';
import { UpdateUserDetailSchema, UserCreateSchema, UserIdSchema, UsersQuerySchema } from './user.validations';

const router = Router();

router.route('/').get(validateReqQuery(UsersQuerySchema), getUsers).post(validateReqBody(UserCreateSchema), createUser);

router
    .route('/:userId')
    .all(validateReqParams(UserIdSchema))
    .get(getUserDetails)
    .patch(validateReqBody(UpdateUserDetailSchema), updateUserDetails)
    .delete(deleteUser);

export default router;
