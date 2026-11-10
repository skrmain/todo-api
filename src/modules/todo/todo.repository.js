export function createTodoRepository() {
    const todos = new Map();
    let nextId = 1;

    return {
        list() {
            return Array.from(todos.values());
        },
        get(id) {
            return todos.get(id) ?? null;
        },
        create(todo) {
            const createdTodo = { id: nextId++, ...todo };
            todos.set(createdTodo.id, createdTodo);
            return createdTodo;
        },
        update(id, changes) {
            const todo = todos.get(id);
            if (!todo) {
                return null;
            }

            const updatedTodo = { ...todo, ...changes };
            todos.set(id, updatedTodo);
            return updatedTodo;
        },
        delete(id) {
            return todos.delete(id);
        },
    };
}
