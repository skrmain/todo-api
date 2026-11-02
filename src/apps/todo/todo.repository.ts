import { Types } from 'mongoose';

import { TodoModel } from './todo.models.js';

type NewTodo = {
    title: string;
    detail?: string;
    userId?: Types.ObjectId | string;
};

type TodoChanges = {
    title?: string;
    detail?: string;
    done?: boolean;
};

export function findTodoById(id: string, select = '') {
    return TodoModel.findById(id, select).lean();
}

export function insertTodo(todo: NewTodo) {
    return TodoModel.create(todo);
}

export function updateTodoById(id: string, changes: TodoChanges | Record<string, unknown>) {
    return TodoModel.findByIdAndUpdate(id, changes, { returnDocument: 'after', runValidators: true }).lean();
}

export function removeTodoById(id: string) {
    return TodoModel.findByIdAndDelete(id).lean();
}

export function todoExistsById(id: string) {
    return TodoModel.exists({ _id: id }).lean();
}
