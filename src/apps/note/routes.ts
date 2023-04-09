import { Router } from 'express';

// eslint-disable-next-line object-curly-newline
import { validateReqBody, checkUserNotePermission, checkNoteExists, validateReqQuery } from '../../shared/middleware';
import { NoteCreateUpdateSchemaV, NoteQueryV, UserNotePermissionSchemaV } from './validation';

import { UserNotePermissions } from '../../shared/constants';
import { addUserToNote, createNote, deleteOneNote, getAllNotes, getOneNote, removeUserFromNote, updateOneNote } from './controller';

const router = Router();

router.post('/', validateReqBody(NoteCreateUpdateSchemaV), createNote);
router.get('/', validateReqQuery(NoteQueryV), getAllNotes);
router.get('/:noteId', checkNoteExists, checkUserNotePermission(UserNotePermissions.read), getOneNote);
router.patch(
    '/:noteId',
    checkNoteExists,
    checkUserNotePermission(UserNotePermissions.write),
    validateReqBody(NoteCreateUpdateSchemaV),
    updateOneNote
);
router.delete('/:noteId', checkNoteExists, checkUserNotePermission(UserNotePermissions.delete), deleteOneNote);

router.patch(
    '/:noteId/users/:userId/permissions',
    checkNoteExists,
    checkUserNotePermission(UserNotePermissions.share),
    validateReqBody(UserNotePermissionSchemaV),
    addUserToNote
);
router.delete('/:noteId/users/:userId/permissions', checkNoteExists, checkUserNotePermission(UserNotePermissions.share), removeUserFromNote);

export default router;
