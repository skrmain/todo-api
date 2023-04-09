export const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export enum dbCollections {
    user = 'users',
    product = 'products',
    cart = 'carts',
    savedProduct = 'savedProducts',
    order = 'orders',
    note = 'notes',
    userNote = 'user_notes',
}

export enum NoteStatus {
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

export enum UserNotePermissions {
    read = 'read',
    write = 'write',
    delete = 'delete',
    share = 'share',
}

export const swaggerOptions = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    swagger: '2.0',
    definition: {
        openapi: '3.1.0',
        swagger: '2.0',
        info: {
            title: 'ExpressJS-StoreAPI',
            version: '0.1.0',
            description: 'Store REST API',
        },
        servers: [{ url: 'http://localhost:8000' }],
    },
    apis: ['./src/apps/**/routes.ts', 'swagger.yml'],
};

export const SortOrder = {
    asc: 'asc',
    desc: 'desc',
};

export const MongoSortOrder = {
    asc: 1,
    desc: -1,
};

export const NoteSortByMapping = {
    status: 'noteId.status',
    createdAt: 'noteId.createdAt',
    updatedAt: 'noteId.updatedAt',
};
