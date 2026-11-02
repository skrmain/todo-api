import { z } from 'zod';

import { Permissions } from './permission.models.js';

export const UserTodoPermissionSchema = z.object({
    permissions: z.array(z.enum(Permissions)).min(1),
}).strict();
