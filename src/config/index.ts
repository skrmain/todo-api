import packageJson from '../../package.json' with { type: 'json' };

import { z } from 'zod';

export const ProcessEnvSchema = z.object({
    SERVICE_NAME: z.string().trim().default(packageJson.name),
    NODE_ENV: z.string().trim().default('development'),
    PORT: z.number().default(8000),

    GOOGLE_CLIENT_ID: z.string().trim().default('GOOGLE_CLIENT_ID'),
    GOOGLE_PROJECT_ID: z.string().trim().default('GOOGLE_PROJECT_ID'),
    GOOGLE_CLIENT_SECRET: z.string().trim().default('GOOGLE_CLIENT_SECRET'),

    MONGODB_URI: z.string().trim().default('mongodb://localhost:27017'),
    DB_NAME: z.string().trim().default('todo'),

    ENCRYPTION_SECRET: z.string().trim().default('ENCRYPTION_SECRET'),
    JWT_SECRET: z.string().trim().default('JWT_SECRET'),
});

export const config = ProcessEnvSchema.parse(process.env);

export const googleOAuthCred = {
    web: {
        client_id: config.GOOGLE_CLIENT_ID,
        project_id: config.GOOGLE_PROJECT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uris: ['http://localhost:8000', 'http://localhost:3000'],
        javascript_origins: ['http://localhost:8000', 'http://localhost:3000'],
    },
};
