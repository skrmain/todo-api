import { Router } from 'express';

// eslint-disable-next-line object-curly-newline
import { validateReqBody, checkUserNotePermission, checkNoteExists, validateReqQuery } from '../../shared/middleware';
import { NoteCreateUpdateSchema, NoteQuerySchema, UserNotePermissionSchema } from './validation';

import { UserNotePermissions } from '../../shared/constants';
import {
    addUserToNote,
    createNote,
    deleteOneNote,
    getAllNotes,
    getOneNote,
    removeUserFromNote,
    updateOneNote,
} from './controller';

const router = Router();

router
    .route('/')
    .post(validateReqBody(NoteCreateUpdateSchema), createNote)
    .get(validateReqQuery(NoteQuerySchema), getAllNotes);

router
    .route('/:noteId')
    .all(checkNoteExists)
    .get(checkUserNotePermission(UserNotePermissions.read), getOneNote)
    .patch(checkUserNotePermission(UserNotePermissions.write), validateReqBody(NoteCreateUpdateSchema), updateOneNote)
    .delete(checkUserNotePermission(UserNotePermissions.delete), deleteOneNote);

router
    .route('/:noteId/users/:userId/permissions')
    .all(checkNoteExists)
    .patch(checkUserNotePermission(UserNotePermissions.share), validateReqBody(UserNotePermissionSchema), addUserToNote)
    .delete(checkUserNotePermission(UserNotePermissions.share), removeUserFromNote);

export default router;
