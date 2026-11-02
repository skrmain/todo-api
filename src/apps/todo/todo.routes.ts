import { Router } from 'express';

import { TodoCreateUpdateSchema, TodoIdSchema, TodoQuerySchema } from './todo.validations.js';
import { validateReqBody, validateReqParams, validateReqQuery } from '../../common/middleware.js';
import permissionRoutes from '../permission/permission.routes.js';
import { Permissions } from '../permission/permission.models.js';
import { checkEntityPermission } from '../permission/permission.middlewares.js';
import { createTodo, deleteOne, getAll, getOne, updateOne } from './todo.controller.js';
import { todoExists } from './todo.middlewares.js';

export const todoRoutes = Router();

todoRoutes.get('/', validateReqQuery(TodoQuerySchema), getAll);
todoRoutes.post('/', validateReqBody(TodoCreateUpdateSchema), createTodo);

todoRoutes.use('/:todoId', validateReqParams(TodoIdSchema), todoExists);
todoRoutes.get('/:todoId', checkEntityPermission(Permissions.read), getOne);
todoRoutes.patch('/:todoId', checkEntityPermission(Permissions.write), validateReqBody(TodoCreateUpdateSchema), updateOne);
todoRoutes.delete('/:todoId', checkEntityPermission(Permissions.delete), deleteOne);

todoRoutes.use('/:todoId/users/:userId/permissions', permissionRoutes);
