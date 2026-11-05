import packageJson from '../../package.json' with { type: 'json' };

import { z } from 'zod';

export const ProcessEnvSchema = z.object({
    SERVICE_NAME: z.string().trim().default(packageJson.name),
    NODE_ENV: z.string().trim().default('development'),
    PORT: z.number().default(8000),

    MONGODB_URI: z.string().trim().default('mongodb://localhost:27017'),
    DB_NAME: z.string().trim().default('todo'),

    ENCRYPTION_SECRET: z.string().trim().default('ENCRYPTION_SECRET'),
    JWT_SECRET: z.string().trim().default('JWT_SECRET'),
});

export const env = ProcessEnvSchema.parse(process.env);
