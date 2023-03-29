/**
 *
 * @param {object} todo
 * @returns
 */
const parseUserTodo = (todo) => ({
    _id: todo.todoId?._id,
    title: todo.todoId?.title,
    detail: todo.todoId?.detail,
    status: todo.todoId?.status,
    createdAt: todo.todoId?.createdAt,
    updateAt: todo.todoId?.updatedAt,
    permissions: todo.permissions,
});

/**
 *
 * @param {Array} todos
 */
const parseUserTodos = (todos) => todos.map(parseUserTodo);

module.exports = { parseUserTodo, parseUserTodos };
