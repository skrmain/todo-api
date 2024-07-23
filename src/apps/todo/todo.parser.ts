export const parseUserTodo = (todo: any) => ({
    _id: todo.todoId?._id,
    title: todo.todoId?.title,
    detail: todo.todoId?.detail,
    status: todo.todoId?.status,
    createdAt: todo.todoId?.createdAt,
    updateAt: todo.todoId?.updatedAt,
    permissions: todo.permissions,
});

export const parseUserTodos = (todos: any[]) => todos.map(parseUserTodo);
