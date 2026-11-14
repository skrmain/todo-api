import type { RequestHandler } from 'express';

import { validateInput } from '../../utils/validation.js';
import { createTodoSchema, updateTodoSchema } from './todo.schema.js';

import { todoService } from './todo.service.js';

export const createTodo: RequestHandler = async (req, res) => {
    const body = validateInput(createTodoSchema, req.body);
    res.status(201).json(await todoService.createTodo(body));
};

export const getTodos: RequestHandler = async (_req, res) => {
    res.status(200).json(await todoService.getTodos());
};

export const updateTodo: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };
    const body = validateInput(updateTodoSchema, req.body);
    res.status(200).json(await todoService.updateTodo(id, body));
};

export const deleteTodo: RequestHandler = async (req, res) => {
    const { id } = req.params as { id: string };
    res.status(200).json(await todoService.deleteTodo(id));
};
