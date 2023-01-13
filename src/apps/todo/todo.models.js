const { Schema, Types, model } = require('mongoose');
const { TodoStatus, ModelNames } = require('../../shared/constants');

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
            ref: ModelNames.user,
        },
    },
    { timestamps: true }
);

module.exports = model(ModelNames.todo, TodoSchema);
