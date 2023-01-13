module.exports = {
    port: process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET || 'secret',
    mongoDbUri: process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017',
    dbName: process.env.DB_NAME || 'test',
    encryptionSecret: process.env.ENCRYPTION_SECRET || 'secret',
};
