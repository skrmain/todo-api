const Database = require('../../shared/database');
const UserTodoModel = require('./model');

class UserTodoService extends Database {}

const userTodoService = new UserTodoService(UserTodoModel);

module.exports = userTodoService;
