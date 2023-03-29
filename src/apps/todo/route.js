const { Router } = require('express');

// eslint-disable-next-line object-curly-newline
const { validateReqBody, checkUserTodoPermission, checkTodoExists, validateReqQuery } = require('../../shared/middleware');
const { TodoCreateUpdateSchemaV, TodoQueryV, UserTodoPermissionSchemaV } = require('./validation');

const todoController = require('./controller');
const { UserTodoPermissions } = require('../../shared/constants');

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

module.exports = router;
