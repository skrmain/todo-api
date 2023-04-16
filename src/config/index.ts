export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017',
    jwtSecret: process.env.JWT_SECRET || 'secret',
};
