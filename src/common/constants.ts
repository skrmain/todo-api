export const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export enum DbCollections {
    user = 'users',
    todo = 'todos',
    userTodos = 'user_todos',
    permissions = 'permissions',
}

export enum TodoStatus {
    created = 'created',
    done = 'done',
    archive = 'archive',
}

export enum UserStatus {
    pending = 'pending', // not-registered
    active = 'active', // registered
    suspended = 'suspended', // suspended by Admin
    deleted = 'deleted', // deleted by user
}

export enum UserTodoPermissions {
    read = 'read',
    write = 'write',
    delete = 'delete',
    share = 'share',
}

export const SortOrder = {
    asc: 'asc',
    desc: 'desc',
};

export const MongoSortOrder = {
    asc: 1,
    desc: -1,
};

export const TodoSortByMapping = {
    status: 'todoId.status',
    createdAt: 'todoId.createdAt',
    updatedAt: 'todoId.updatedAt',
};
