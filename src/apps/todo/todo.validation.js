const Joi = require('joi');

const { TodoStatus } = require('../../shared/constants');

const VTodoCreateUpdateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(20).required(),
    detail: Joi.string().trim().allow(''),
    status: Joi.string()
        .trim()
        .valid(...Object.values(TodoStatus)),
});

module.exports = {
    VTodoCreateUpdateSchema,
};
