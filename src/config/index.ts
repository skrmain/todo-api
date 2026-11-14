import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(8000),
    WORKERS: z.coerce.number().int().positive().default(2),
});

export const env = envSchema.parse(process.env);
