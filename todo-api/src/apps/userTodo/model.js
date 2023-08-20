const { Schema, Types, model } = require('mongoose');
const { ModelNames, UserTodoPermissions } = require('../../shared/constants');

const UserTodoSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: ModelNames.user,
    },
    todoId: {
        type: Types.ObjectId,
        required: true,
        ref: ModelNames.todo,
    },
    addedBy: {
        type: Types.ObjectId,
        required: true,
        ref: ModelNames.user,
    },
    permissions: {
        type: [String],
        default: '',
        enum: Object.values(UserTodoPermissions),
    },
});

const UserTodoModel = model(ModelNames.userTodo, UserTodoSchema);

module.exports = UserTodoModel;
