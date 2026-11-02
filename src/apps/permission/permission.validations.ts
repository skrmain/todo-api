import Joi from 'joi';

import { Permissions } from './permission.models';

export const UserTodoPermissionSchema = Joi.object({
    permissions: Joi.array()
        .items(...Object.values(Permissions))
        .required()
        .min(1),
});
