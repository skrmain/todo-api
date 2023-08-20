import { Schema, Types, model } from 'mongoose';

import { NoteStatus, dbCollections } from '../../shared/constants';

const NoteSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        detail: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            default: NoteStatus.created,
            enum: Object.values(NoteStatus),
        },
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: dbCollections.user,
        },
    },
    { timestamps: true }
);

export const NoteModel = model(dbCollections.note, NoteSchema);
