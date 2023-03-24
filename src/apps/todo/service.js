const Database = require('../../shared/database');
const TodoModel = require('./model');

class TodoService extends Database {}

const todoService = new TodoService(TodoModel);

module.exports = todoService;
