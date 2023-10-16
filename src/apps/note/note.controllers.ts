import { Request, Response } from 'express';

import noteService from './note.service';
import permissionService from '../permission/permission.service';

import { successResponse } from '../../shared/utils';
import { UserNotePermissions } from '../../shared/constants';
import { parseUserNotes, parseUserNote } from './note.parser';
import { AuthRequest } from '../../shared/types';

export const create = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const note = await noteService.create({ ...req.body, userId });
    await permissionService.create({
        userId,
        entity: 'note',
        entityId: note._id,
        lastUpdatedBy: req.user?._id,
        permissions: [...Object.values(UserNotePermissions)],
    });
    return res.send(successResponse({ data: { _id: note._id } }));
};

export const getAll = async (req: AuthRequest, res: Response) => {
    const { pageNumber, pageSize, sortOrder, sortBy, status, title } = req.query as any;
    const filter: any = {};

    if (status) {
        filter['noteId.status'] = status;
    }
    if (title) {
        filter['noteId.title'] = { $regex: new RegExp(title, 'i') };
    }

    const { notes, total } = await noteService.getUserNotes({
        userId: req.user?._id,
        pageNumber,
        pageSize,
        sortOrder,
        sortBy,
        filter,
    });
    const parsedNotes = parseUserNotes(notes);

    return res.send(
        successResponse({ data: parsedNotes, metadata: { pageNumber, pageSize, sortOrder, sortBy, total } })
    );
};

export const getOne = async (req: AuthRequest, res: Response) => {
    const note = await noteService.getOne({ _id: req.params.noteId }, '-userId');
    const permissions = await permissionService.getOne({ entityId: req.params.noteId, userId: req.user?._id });
    return res.send(successResponse({ data: parseUserNote({ noteId: note, permissions: permissions?.permissions }) }));
};

export const updateOne = async (req: Request, res: Response) => {
    await noteService.updateOne({ _id: req.params.noteId }, { ...req.body });
    return res.send(successResponse({ message: 'Updated' }));
};

export const deleteOne = async (req: Request, res: Response) => {
    await noteService.deleteOne({ _id: req.params.noteId });
    await permissionService.deleteMany({ entityId: req.params.noteId });
    return res.send(successResponse({ message: 'Successfully Deleted' }));
};

export const addUserToNote = async (req: AuthRequest, res: Response) => {
    if (req.user?._id.toString() === req.params.userId.toString()) {
        throw new Error('Invalid Operation');
    }
    const userNote = await permissionService.getOne({
        entityId: req.params.noteId,
        userId: req.params.userId,
    });
    if (userNote) {
        await permissionService.updateOne({ _id: userNote._id }, { $set: { permissions: [...req.body.permissions] } });
    } else {
        await permissionService.create({
            entityId: req.params.noteId,
            entity: 'note',
            userId: req.params.userId,
            lastUpdatedBy: req.user?._id,
            permissions: [...req.body.permissions],
        });
    }
    return res.send(successResponse({ message: 'Permissions Updated' }));
};

export const removeUserFromNote = async (req: Request, res: Response) => {
    await permissionService.deleteOne({ entityId: req.params.noteId, userId: req.params.userId });
    return res.send(successResponse({ message: 'User Successfully Removed' }));
};
