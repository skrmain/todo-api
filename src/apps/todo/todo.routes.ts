import { Router } from 'express';

import { TodoCreateUpdateSchema, TodoIdSchema, TodoQuerySchema, UserTodoPermissionSchema } from './todo.validations';
import { validateReqBody, validateReqParams, validateReqQuery } from '../../common/middleware';
import { Permissions } from '../permission/permission.models';
import { addUserToTodo, checkTodoPermission, create, deleteOne, getAll, getOne, removeUserFromTodo, todoExists, updateOne } from './todo.controller';

export const todoRoutes = Router();

todoRoutes.get('/', validateReqQuery(TodoQuerySchema), getAll);
todoRoutes.post('/', validateReqBody(TodoCreateUpdateSchema), create);

todoRoutes.use('/:todoId', validateReqParams(TodoIdSchema), todoExists);
todoRoutes.get('/:todoId', checkTodoPermission(Permissions.read), getOne);
todoRoutes.patch('/:todoId', checkTodoPermission(Permissions.write), validateReqBody(TodoCreateUpdateSchema), updateOne);
todoRoutes.delete('/:todoId', checkTodoPermission(Permissions.delete), deleteOne);

todoRoutes.use('/:todoId/users/:userId/permissions', todoExists, checkTodoPermission(Permissions.share));
todoRoutes.patch('/:todoId/users/:userId/permissions', validateReqBody(UserTodoPermissionSchema), addUserToTodo);
todoRoutes.delete('/:todoId/users/:userId/permissions', removeUserFromTodo);
