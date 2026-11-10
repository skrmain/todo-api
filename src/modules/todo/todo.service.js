export function createTodoService(repository) {
    return {
        listTodos() {
            return repository.list();
        },
        getTodo(id) {
            return repository.get(id);
        },
        createTodo(todo) {
            return repository.create(todo);
        },
        updateTodo(id, changes) {
            return repository.update(id, changes);
        },
        deleteTodo(id) {
            return repository.delete(id);
        },
    };
}
