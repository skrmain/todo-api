import { Router } from 'express';

import userController from './controller';
import { validateReqBody, validateReqQuery } from '../../shared/middleware';
import { UpdateUserDetailSchema, UsersQuerySchema } from './validation';

const router = Router();

router.get('/', validateReqQuery(UsersQuerySchema), userController.getUsers);
router
    .route('/me')
    .get(userController.getUserDetails)
    .patch(validateReqBody(UpdateUserDetailSchema), userController.updateUserDetails)
    .delete(userController.deleteUser);
// TODO: Add search route

export default router;
