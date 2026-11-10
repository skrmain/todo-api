export function registerTodoRoutes(router, controller) {
    router.add('GET', '/todos', controller.list);
    router.add('POST', '/todos', controller.create);
    router.add('GET', '/todos/:id', controller.get);
    router.add('PUT', '/todos/:id', controller.update);
    router.add('PATCH', '/todos/:id', controller.update);
    router.add('DELETE', '/todos/:id', controller.delete);
}
