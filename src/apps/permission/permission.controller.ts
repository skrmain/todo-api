import { Request, Response } from 'express';

import { AuthRequest } from '../../common/types';
import { successResponse } from '../../common/utils';
import permissionService from './permission.service';

type TodoPermissionRequest = AuthRequest<{ todoId: string; userId: string }>;

export async function addUserToTodo(req: TodoPermissionRequest, res: Response) {
    await permissionService.grantTodoAccess({
        todoId: req.params.todoId,
        userId: req.params.userId,
        updatedBy: req.user?._id,
        permissions: req.body.permissions,
    });
    return res.send(successResponse({ message: 'Permissions Updated' }));
}

export async function removeUserFromTodo(req: Request<{ todoId: string; userId: string }>, res: Response) {
    await permissionService.revokeTodoAccess(req.params.todoId, req.params.userId);
    return res.send(successResponse({ message: 'User Successfully Removed' }));
}
