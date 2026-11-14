import { AppError, NotFoundError } from '../../errors/app-error.js';

import type { UpdateTodoInput, CreateTodoInput } from './todo.schema.js';
import { todoRepository } from './todo.repository.js';

export const todoService = {
    createTodo: async (data: CreateTodoInput) => {
        return todoRepository.createTodo(data);
    },

    getTodos: async () => {
        return todoRepository.getTodos();
    },

    updateTodo: async (id: string, updatedFields: UpdateTodoInput) => {
        const todo = await todoRepository.getTodoById(id);
        if (!todo) throw new NotFoundError('Todo not found');

        if (todo.isDeleted) throw new NotFoundError('Todo not found');
        if (todo.completed) throw new AppError('Cannot update a completed todo', '', 400);

        return todoRepository.updateTodo(id, updatedFields);
    },

    deleteTodo: async (id: string) => {
        const todo = await todoRepository.getTodoById(id);
        if (!todo) throw new NotFoundError('Todo not found');

        return todoRepository.deleteTodo(id);
    },
};
