import { Schema, Types, model } from 'mongoose';

import { UserModel } from '../user/user.models';

export enum TodoStatus {
    created = 'created',
    done = 'done',
    archive = 'archive',
}

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
            ref: UserModel.modelName,
        },
    },
    { timestamps: true }
);

export const TodoModel = model('todos', TodoSchema);
