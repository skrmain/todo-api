import { Schema, Types, model } from 'mongoose';

import { UserModel } from '../user/user.models';

const TodoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        detail: {
            type: String,
            required: false,
            trim: true,
            maxlength: 5000,
        },
        done: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: UserModel.modelName,
        },
    },
    { timestamps: true },
);

export const TodoModel = model('todos', TodoSchema);
