export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    mongodb_uri: process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017',
    jwt_secret: process.env.JWT_SECRET || 'secret',
};
