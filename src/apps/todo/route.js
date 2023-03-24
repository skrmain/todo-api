const { Router } = require('express');

const { validateReqBody, checkUserTodoPermission, checkTodoExists } = require('../../shared/middleware');

const todoValidation = require('./validation');
const todoController = require('./controller');
const { UserTodoPermissions } = require('../../shared/constants');

const router = Router();

router.post('/', validateReqBody(todoValidation.VTodoCreateUpdateSchema), todoController.create);
router.get('/', todoController.getAll);
router.get('/:todoId', checkTodoExists, checkUserTodoPermission(UserTodoPermissions.read), todoController.getOne);
router.patch(
    '/:todoId',
    checkTodoExists,
    checkUserTodoPermission(UserTodoPermissions.write),
    validateReqBody(todoValidation.VTodoCreateUpdateSchema),
    todoController.updateOne
);
router.delete('/:todoId', checkTodoExists, checkUserTodoPermission(UserTodoPermissions.delete), todoController.deleteOne);

router.patch(
    '/:todoId/users/:userId/permissions',
    checkTodoExists,
    checkUserTodoPermission(UserTodoPermissions.share),
    validateReqBody(todoValidation.VUserTodoPermissionSchema),
    todoController.addUser
);
router.delete('/:todoId/users/:userId/permissions', checkTodoExists, checkUserTodoPermission(UserTodoPermissions.share), todoController.removeUser);

module.exports = router;
