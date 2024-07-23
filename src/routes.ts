import { NextFunction, Request, Response, Router } from 'express';

import { exists, validateReqQuery, validateReqParams } from './shared/middleware';
import {
    NoteCreateUpdateSchema,
    NoteIdSchema,
    NoteQuerySchema,
    UserNotePermissionSchema,
} from './apps/todo/todo.validations';

import { UserNotePermissions } from './shared/constants';
import {
    addUserToNote,
    create,
    deleteOne,
    getAll,
    getOne,
    removeUserFromNote,
    updateOne,
} from './apps/todo/todo.controllers';
import { checkPermission } from './apps/permission/permission.middlewares';
import { register, login, refreshAccessToken, getAuthorizeUrl, callback, checkAuth } from './apps/auth/auth.controller';

import { validateReqBody } from './shared/middleware';
import { LoginSchema, RegisterSchema, TokenRefreshSchema } from './apps/auth/auth.validations';
import { getUserDetails, updateUserDetails } from './apps/user/user.controllers';
import { UpdateUserDetailSchema } from './apps/user/user.validations';

import noteService from './apps/todo/todo.service';

const router = Router();

router.get('/', (req, res) => res.send('Ok'));
router.post('/register', validateReqBody(RegisterSchema), register);
router.post('/login', validateReqBody(LoginSchema), login);
router.post('/token', validateReqBody(TokenRefreshSchema), refreshAccessToken);

router.get('/authorize-url', getAuthorizeUrl);
router.post('/callback', callback);

router.get('/user', checkAuth, getUserDetails);
router.patch('/user', validateReqBody(UpdateUserDetailSchema), checkAuth, updateUserDetails);

const noteExists = (req: Request, res: Response, next: NextFunction) =>
    exists(noteService, req.params.noteId, req, res, next);

const checkNotePermission = (permission: any) => (req: Request, res: Response, next: NextFunction) =>
    checkPermission(permission, req.params.noteId, req, res, next);

router
    .route('/notes')
    .post(validateReqBody(NoteCreateUpdateSchema), create)
    .get(validateReqQuery(NoteQuerySchema), getAll);

router
    .route('/notes/:noteId')
    .all(validateReqParams(NoteIdSchema), noteExists)
    .get(checkNotePermission(UserNotePermissions.read), getOne)
    .patch(checkNotePermission(UserNotePermissions.write), validateReqBody(NoteCreateUpdateSchema), updateOne)
    .delete(checkNotePermission(UserNotePermissions.delete), deleteOne);

router
    .route('/notes/:noteId/users/:userId/permissions')
    .all(noteExists)
    .patch(checkNotePermission(UserNotePermissions.share), validateReqBody(UserNotePermissionSchema), addUserToNote)
    .delete(checkNotePermission(UserNotePermissions.share), removeUserFromNote);

export default router;
