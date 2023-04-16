import { Request, Response } from 'express';

import noteService from './service';
import userNoteService from '../userNote/service';

import { successResponse } from '../../shared/utils';
import { UserNotePermissions } from '../../shared/constants';
import { parseUserNotes, parseUserNote } from './parser';
import { AuthRequest } from '../../shared/types';

export const createNote = async (req: AuthRequest, res: Response) => {
    const note = await noteService.create({ ...req.body, userId: req.user?._id });
    await userNoteService.create({
        userId: req.user?._id,
        noteId: note._id,
        permissions: [...Object.values(UserNotePermissions)],
        addedBy: req.user?._id,
    });
    return res.send(successResponse({ data: { _id: note._id } }));
};

export const getAllNotes = async (req: AuthRequest, res: Response) => {
    const { pageNumber, pageSize, sortOrder, sortBy, status, title } = req.query as any;
    const filter: any = {};

    if (status) {
        filter['noteId.status'] = status;
    }
    if (title) {
        filter['noteId.title'] = { $regex: new RegExp(title, 'i') };
    }

    const { notes, total } = await userNoteService.getUserNotes({
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

export const getOneNote = async (req: AuthRequest, res: Response) => {
    const note = await userNoteService
        .getOne({ noteId: req.params.noteId, userId: req.user?._id }, '-addedBy -userId')
        .populate('noteId');
    return res.send(successResponse({ data: parseUserNote(note) }));
};

export const updateOneNote = async (req: Request, res: Response) => {
    await noteService.updateOne({ _id: req.params.noteId }, { ...req.body });
    return res.send(successResponse({ message: 'Updated' }));
};

export const deleteOneNote = async (req: Request, res: Response) => {
    await noteService.deleteOne({ _id: req.params.noteId });
    await userNoteService.deleteMany({ noteId: req.params.noteId });
    return res.send(successResponse({ message: 'Successfully Deleted' }));
};

export const addUserToNote = async (req: AuthRequest, res: Response) => {
    if (req.user?._id.toString() === req.params.userId.toString()) {
        throw new Error('Invalid Operation');
    }
    const userNote = await userNoteService.getOne({
        noteId: req.params.noteId,
        userId: req.params.userId,
    });
    if (userNote) {
        await userNoteService.updateOne(
            {
                _id: userNote._id,
            },
            {
                $set: {
                    permissions: [...req.body.permissions],
                },
            }
        );
    } else {
        await userNoteService.create({
            noteId: req.params.noteId,
            userId: req.params.userId,
            addedBy: req.user?._id,
            permissions: [...req.body.permissions],
        });
    }
    return res.send(successResponse({ message: 'Permissions Updated' }));
};

export const removeUserFromNote = async (req: Request, res: Response) => {
    await userNoteService.deleteOne({ noteId: req.params.noteId, userId: req.params.userId });
    return res.send(successResponse({ message: 'User Successfully Removed' }));
};
