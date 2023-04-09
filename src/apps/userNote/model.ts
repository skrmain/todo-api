import { dbCollections } from '../../shared/constants';

import { Schema, Types, model } from 'mongoose';
import { UserTodoPermissions } from '../../shared/constants';

const UserTodoSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: dbCollections.user,
    },
    todoId: {
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
        enum: Object.values(UserTodoPermissions),
    },
});

export const UserTodoModel = model(dbCollections.userNote, UserTodoSchema);
