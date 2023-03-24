const TodoStatus = {
    created: 'created',
    done: 'done',
    archive: 'archive',
};

const UserTodoPermissions = {
    read: 'read',
    write: 'write',
    delete: 'delete',
    share: 'share',
};

const ModelNames = {
    todo: 'todos',
    user: 'users',
    userTodo: 'user_todos',
};

const SwaggerOptions = {
    swaggerDefinition: {
        // openapi: '3.0.0',
        info: {
            title: 'ExpressJS-TodoAPI',
            version: '0.5.0',
            description: 'ExpressJS-TodoAPI docs',
        },
    },
    apis: ['swagger.yaml'],
};

module.exports = {
    TodoStatus,
    ModelNames,
    UserTodoPermissions,
    SwaggerOptions,
};
