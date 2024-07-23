import { config } from 'dotenv';

config();

export default {
    port: process.env.PORT || 8000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || 'test',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    encryptionSecret: process.env.ENCRYPTION_SECRET || 'secret',
};

export const googleOAuthCred = {
    web: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        project_id: process.env.GOOGLE_PROJECT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uris: ['http://localhost:8000', 'http://localhost:3000'],
        javascript_origins: ['http://localhost:8000', 'http://localhost:3000'],
    },
};
