import { Router } from 'express';

import {
    validateReqBody,
    checkUserNotePermission,
    checkNoteExists,
    validateReqQuery,
    validateReqParams,
} from '../../shared/middleware';
import { NoteCreateUpdateSchema, NoteIdSchema, NoteQuerySchema, UserNotePermissionSchema } from './note.validations';

import { UserNotePermissions } from '../../shared/constants';
import {
    addUserToNote,
    createNote,
    deleteOneNote,
    getAllNotes,
    getOneNote,
    removeUserFromNote,
    updateOneNote,
} from './note.controllers';

const router = Router();

router
    .route('/')
    .post(validateReqBody(NoteCreateUpdateSchema), createNote)
    .get(validateReqQuery(NoteQuerySchema), getAllNotes);

router
    .route('/:noteId')
    .all(checkNoteExists, validateReqParams(NoteIdSchema))
    .get(checkUserNotePermission(UserNotePermissions.read), getOneNote)
    .patch(checkUserNotePermission(UserNotePermissions.write), validateReqBody(NoteCreateUpdateSchema), updateOneNote)
    .delete(checkUserNotePermission(UserNotePermissions.delete), deleteOneNote);

router
    .route('/:noteId/users/:userId/permissions')
    .all(checkNoteExists)
    .patch(checkUserNotePermission(UserNotePermissions.share), validateReqBody(UserNotePermissionSchema), addUserToNote)
    .delete(checkUserNotePermission(UserNotePermissions.share), removeUserFromNote);

export default router;
