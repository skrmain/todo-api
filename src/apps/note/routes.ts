import { Router } from 'express';

// eslint-disable-next-line object-curly-newline
import { validateReqBody, checkUserTodoPermission, checkTodoExists, validateReqQuery } from '../../shared/middleware';
import { TodoCreateUpdateSchemaV, TodoQueryV, UserTodoPermissionSchemaV } from './validation';

import todoController from './controller';
import { UserTodoPermissions } from '../../shared/constants';

const router = Router();

router.post('/', validateReqBody(TodoCreateUpdateSchemaV), todoController.create);
router.get('/', validateReqQuery(TodoQueryV), todoController.getAll);
router.get('/:todoId', checkTodoExists, checkUserTodoPermission(UserTodoPermissions.read), todoController.getOne);
router.patch(
    '/:todoId',
    checkTodoExists,
    checkUserTodoPermission(UserTodoPermissions.write),
    validateReqBody(TodoCreateUpdateSchemaV),
    todoController.updateOne
);
router.delete('/:todoId', checkTodoExists, checkUserTodoPermission(UserTodoPermissions.delete), todoController.deleteOne);

router.patch(
    '/:todoId/users/:userId/permissions',
    checkTodoExists,
    checkUserTodoPermission(UserTodoPermissions.share),
    validateReqBody(UserTodoPermissionSchemaV),
    todoController.addUser
);
router.delete('/:todoId/users/:userId/permissions', checkTodoExists, checkUserTodoPermission(UserTodoPermissions.share), todoController.removeUser);

export default router;
