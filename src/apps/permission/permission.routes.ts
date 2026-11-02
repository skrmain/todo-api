import { Router } from 'express';

import { validateReqBody } from '../../common/middleware.js';
import { Permissions } from './permission.models.js';
import { addUserToTodo, removeUserFromTodo } from './permission.controller.js';
import { checkEntityPermission } from './permission.middlewares.js';
import { UserTodoPermissionSchema } from './permission.validations.js';

const permissionRoutes = Router({ mergeParams: true });

permissionRoutes.use(checkEntityPermission(Permissions.share));
permissionRoutes.patch('/', validateReqBody(UserTodoPermissionSchema), addUserToTodo);
permissionRoutes.delete('/', removeUserFromTodo);

export default permissionRoutes;
