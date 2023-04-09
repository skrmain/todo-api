import Joi from 'joi';

import { NoteStatus, UserNotePermissions, SortOrder } from '../../shared/constants';

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
    pageNumber: Joi.number().min(1).default(1),
    pageSize: Joi.number().min(1).max(100).default(10),
    sortOrder: Joi.string()
        .valid(...Object.values(SortOrder))
        .default(SortOrder.desc),
    sortBy: Joi.string()
        .valid(...['status', 'createdAt', 'updatedAt'])
        .default('updatedAt'),
    status: Joi.string().valid(...Object.values(NoteStatus)),
    title: Joi.string(),
});
