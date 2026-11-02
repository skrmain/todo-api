import { z } from 'zod';

export const UpdateUserDetailSchema = z.object({
    name: z.string().trim().min(3).max(20),
}).strict();
