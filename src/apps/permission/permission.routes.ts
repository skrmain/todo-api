import { Router } from 'express';

import { validateReqBody } from '../../common/middleware';
import { Permissions } from './permission.models';
import { addUserToTodo, removeUserFromTodo } from './permission.controller';
import { checkEntityPermission } from './permission.middlewares';
import { UserTodoPermissionSchema } from './permission.validations';

const permissionRoutes = Router({ mergeParams: true });

permissionRoutes.use(checkEntityPermission(Permissions.share));
permissionRoutes.patch('/', validateReqBody(UserTodoPermissionSchema), addUserToTodo);
permissionRoutes.delete('/', removeUserFromTodo);

export default permissionRoutes;
