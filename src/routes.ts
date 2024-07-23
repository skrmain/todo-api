import { Router } from 'express';

import { validateReqQuery, validateReqParams } from './common/middleware';
import {
    TodoCreateUpdateSchema,
    TodoIdSchema,
    TodoQuerySchema,
    UserTodoPermissionSchema,
} from './apps/todo/todo.validations';

import { UserTodoPermissions } from './common/constants';
import {
    addUserToTodo,
    deleteOne,
    getAll,
    getOne,
    removeUserFromTodo,
    updateOne,
    checkTodoPermission,
    todoExists,
} from './apps/todo/todo.controllers';
import * as todoController from './apps/todo/todo.controllers';
import { register, login, refreshAccessToken, getAuthorizeUrl, callback, checkAuth } from './apps/auth/auth.controller';

import { validateReqBody } from './common/middleware';
import { LoginSchema, RegisterSchema, TokenRefreshSchema } from './apps/auth/auth.validations';
import { getUserDetails, updateUserDetails } from './apps/user/user.controllers';
import { UpdateUserDetailSchema } from './apps/user/user.validations';

const router = Router();

router.get('/', (req, res) => res.send('Ok'));

router.post('/register', validateReqBody(RegisterSchema), register);
router.post('/login', validateReqBody(LoginSchema), login);
router.post('/token', validateReqBody(TokenRefreshSchema), refreshAccessToken);

router.get('/authorize-url', getAuthorizeUrl);
router.post('/callback', callback);

router
    .route('/user')
    .all(checkAuth)
    .get(getUserDetails)
    .patch(validateReqBody(UpdateUserDetailSchema), checkAuth, updateUserDetails);

router
    .route('/todos')
    .get(validateReqQuery(TodoQuerySchema), getAll)
    .post(validateReqBody(TodoCreateUpdateSchema), todoController.create);

router
    .route('/todos/:todoId')
    .all(validateReqParams(TodoIdSchema), todoExists)
    .get(checkTodoPermission(UserTodoPermissions.read), getOne)
    .patch(checkTodoPermission(UserTodoPermissions.write), validateReqBody(TodoCreateUpdateSchema), updateOne)
    .delete(checkTodoPermission(UserTodoPermissions.delete), deleteOne);

router
    .route('/todos/:todoId/users/:userId/permissions')
    .all(todoExists)
    .patch(checkTodoPermission(UserTodoPermissions.share), validateReqBody(UserTodoPermissionSchema), addUserToTodo)
    .delete(checkTodoPermission(UserTodoPermissions.share), removeUserFromTodo);

export default router;
