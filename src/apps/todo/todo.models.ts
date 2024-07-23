import { Schema, Types, model } from 'mongoose';

import { TodoStatus, DbCollections } from '../../common/constants';

const TodoSchema = new Schema(
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
            default: TodoStatus.created,
            enum: Object.values(TodoStatus),
        },
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: DbCollections.user,
        },
    },
    { timestamps: true }
);

export const TodoModel = model(DbCollections.todo, TodoSchema);
