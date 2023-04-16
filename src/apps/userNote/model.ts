import { Schema, Types, model } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { UserNotePermissions } from '../../shared/constants';

const UserNoteSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: dbCollections.user,
    },
    noteId: {
        type: Types.ObjectId,
        required: true,
        ref: dbCollections.note,
    },
    addedBy: {
        type: Types.ObjectId,
        required: true,
        ref: dbCollections.user,
    },
    permissions: {
        type: [String],
        default: '',
        enum: Object.values(UserNotePermissions),
    },
});

export const UserNoteModel = model(dbCollections.userNote, UserNoteSchema);
