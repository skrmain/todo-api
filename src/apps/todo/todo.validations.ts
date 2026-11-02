import { z } from 'zod';

import { isValidObjectId } from '../../common/utils.js';
import { SortOrder } from '../../common/types.js';

const queryNumber = (defaultValue: number, max?: number) =>
    z
        .preprocess(
            (value) => (typeof value === 'string' ? Number(value) : value),
            max === undefined ? z.number().min(1) : z.number().min(1).max(max)
        )
        .default(defaultValue);

export const getPaginationParams = () => ({
    pageNumber: queryNumber(1),
    pageSize: queryNumber(50, 100),
});

export const getSortingParams = (sortByParams: string[]) => ({
    sortOrder: z.enum(SortOrder).default(SortOrder.desc),
    sortBy: z.string().refine((value) => ['createdAt', 'updatedAt', ...sortByParams].includes(value)).default('updatedAt'),
});

export const TodoCreateUpdateSchema = z.object({
    title: z.string().trim().min(3).max(20),
    detail: z.string().trim().optional(),
}).strict();

export const TodoQuerySchema = z.object({
    ...getPaginationParams(),
    ...getSortingParams(['status']),
    title: z.string().min(1).optional(),
}).strict();

export const TodoIdSchema = z.object({
    todoId: z.string().refine(isValidObjectId, 'Invalid ObjectId'),
}).strict();
