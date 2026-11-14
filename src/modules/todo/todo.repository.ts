import { randomUUID } from 'node:crypto';

import type { CreateTodoInput, UpdateTodoInput } from './todo.schema.js';

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
    description?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
};

const todos: Todo[] = [];

export const todoRepository = {
    createTodo: async (data: CreateTodoInput) => {
        const newTodo = {
            id: randomUUID(),
            title: data.title,
            description: data.description,
            completed: false,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        todos.push(newTodo);
        return newTodo;
    },

    getTodos: async () => {
        return todos;
    },

    getTodoById: async (id: string) => {
        return todos.find((t) => t.id === id);
    },

    updateTodo: async (id: string, updatedFields: UpdateTodoInput) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) throw new Error('Todo not found');
        Object.assign(todo, updatedFields, { updatedAt: new Date() });
        return todo;
    },

    deleteTodo: async (id: string) => {
        const index = todos.findIndex((t) => t.id === id);
        if (index === -1) throw new Error('Todo not found');
        const deletedTodo = todos[index];
        deletedTodo.isDeleted = true;
        deletedTodo.deletedAt = new Date();
        return deletedTodo;
    },
};
