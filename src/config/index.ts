export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8000,
  mongodb_uri: 'mongodb://admin:admin@localhost:27017' || process.env.MONGODB_URI,
  jwt_secret: process.env.JWT_SECRET || 'secret',
};
