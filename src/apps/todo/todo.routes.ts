import { Router } from 'express';

import { TodoCreateUpdateSchema, TodoIdSchema, TodoQuerySchema } from './todo.validations';
import { validateReqBody, validateReqParams, validateReqQuery } from '../../common/middleware';
import permissionRoutes from '../permission/permission.routes';
import { Permissions } from '../permission/permission.models';
import { checkEntityPermission } from '../permission/permission.middlewares';
import { createTodo, deleteOne, getAll, getOne, updateOne } from './todo.controller';
import { todoExists } from './todo.middlewares';

export const todoRoutes = Router();

todoRoutes.get('/', validateReqQuery(TodoQuerySchema), getAll);
todoRoutes.post('/', validateReqBody(TodoCreateUpdateSchema), createTodo);

todoRoutes.use('/:todoId', validateReqParams(TodoIdSchema), todoExists);
todoRoutes.get('/:todoId', checkEntityPermission(Permissions.read), getOne);
todoRoutes.patch('/:todoId', checkEntityPermission(Permissions.write), validateReqBody(TodoCreateUpdateSchema), updateOne);
todoRoutes.delete('/:todoId', checkEntityPermission(Permissions.delete), deleteOne);

todoRoutes.use('/:todoId/users/:userId/permissions', permissionRoutes);
