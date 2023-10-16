import Joi from 'joi';

import { NoteStatus, UserNotePermissions, SortOrder } from '../../shared/constants';
import { ValidateObjectId } from '../../shared/utils';
import { getPaginationParams, getSortingParams } from '../../shared/common.validations';

export const NoteCreateUpdateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(20).required(),
    detail: Joi.string().trim().allow(''),
    status: Joi.string()
        .trim()
        .valid(...Object.values(NoteStatus)),
});

export const UserNotePermissionSchema = Joi.object({
    permissions: Joi.array()
        .items(...Object.values(UserNotePermissions))
        .required()
        .min(1),
});

export const NoteQuerySchema = Joi.object({
    ...getPaginationParams(),
    ...getSortingParams(['status']),
    status: Joi.string().valid(...Object.values(NoteStatus)),
    title: Joi.string(),
});

export const NoteIdSchema = Joi.object({
    noteId: Joi.string().custom(ValidateObjectId),
});
