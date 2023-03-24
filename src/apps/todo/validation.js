const Joi = require('joi');

const { TodoStatus, UserTodoPermissions } = require('../../shared/constants');

const VTodoCreateUpdateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(20).required(),
    detail: Joi.string().trim().allow(''),
    status: Joi.string()
        .trim()
        .valid(...Object.values(TodoStatus)),
});

const VUserTodoPermissionSchema = Joi.object({
    permissions: Joi.array()
        .items(...Object.values(UserTodoPermissions))
        .required()
        .min(1),
});

module.exports = {
    VTodoCreateUpdateSchema,
    VUserTodoPermissionSchema,
};
