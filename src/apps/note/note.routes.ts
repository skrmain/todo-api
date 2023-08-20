import { NextFunction, Request, Response, Router } from 'express';

import { validateReqBody, exists, validateReqQuery, validateReqParams } from '../../shared/middleware';
import { NoteCreateUpdateSchema, NoteIdSchema, NoteQuerySchema, UserNotePermissionSchema } from './note.validations';

import { UserNotePermissions } from '../../shared/constants';
import { addUserToNote, create, deleteOne, getAll, getOne, removeUserFromNote, updateOne } from './note.controllers';
import { checkPermission } from '../permission/permission.middlewares';
import noteService from './note.service';

const router = Router();

const noteExists = (req: Request, res: Response, next: NextFunction) =>
    exists(noteService, req.params.noteId, req, res, next);

const checkNotePermission = (permission: any) => (req: Request, res: Response, next: NextFunction) =>
    checkPermission(permission, req.params.noteId, req, res, next);

router.route('/').post(validateReqBody(NoteCreateUpdateSchema), create).get(validateReqQuery(NoteQuerySchema), getAll);

router
    .route('/:noteId')
    .all(validateReqParams(NoteIdSchema), noteExists)
    .get(checkNotePermission(UserNotePermissions.read), getOne)
    .patch(checkNotePermission(UserNotePermissions.write), validateReqBody(NoteCreateUpdateSchema), updateOne)
    .delete(checkNotePermission(UserNotePermissions.delete), deleteOne);

router
    .route('/:noteId/users/:userId/permissions')
    .all(noteExists)
    .patch(checkNotePermission(UserNotePermissions.share), validateReqBody(UserNotePermissionSchema), addUserToNote)
    .delete(checkNotePermission(UserNotePermissions.share), removeUserFromNote);

export default router;
