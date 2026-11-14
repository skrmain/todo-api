import z from 'zod';

export const createTodoSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(255, 'Title is too long'),
    description: z.string().min(1, 'Description is required').max(1024, 'Description is too long').optional(),
});

export const updateTodoSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
