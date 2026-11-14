import { Router } from 'express';

import { getTodos, createTodo, updateTodo, deleteTodo } from './todo.controller.js';

export const todoRoutes = Router();

todoRoutes.get('/', getTodos);
todoRoutes.post('/', createTodo);
todoRoutes.put('/:id', updateTodo);
todoRoutes.delete('/:id', deleteTodo);
