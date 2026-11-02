import { PipelineStage } from 'mongoose';

import { getObjectId } from '../../common/utils.js';
import { TodoModel } from '../todo/todo.models.js';
import { PermissionModel } from './permission.models.js';

type UserTodosQuery = {
    userId?: string;
    filter: Record<string, unknown>;
    pageNumber: number;
    pageSize: number;
};

const permissionRepository = {
    getOne(...args: Parameters<typeof PermissionModel.findOne>) {
        const [filter, select = ''] = args;
        return PermissionModel.findOne(filter, `${select} -__v`).lean();
    },

    exists(...args: Parameters<typeof PermissionModel.exists>) {
        return PermissionModel.exists(...args).lean();
    },

    create(...args: Parameters<typeof PermissionModel.create>) {
        return PermissionModel.create(...args);
    },

    updateOne(...args: Parameters<typeof PermissionModel.updateOne>) {
        return PermissionModel.updateOne(...args).lean();
    },

    deleteOne(...args: Parameters<typeof PermissionModel.deleteOne>) {
        return PermissionModel.deleteOne(...args).lean();
    },

    deleteMany(...args: Parameters<typeof PermissionModel.deleteMany>) {
        return PermissionModel.deleteMany(...args).lean();
    },

    async findUserTodos({ userId, filter, pageNumber, pageSize }: UserTodosQuery) {
        const baseStages: PipelineStage[] = [
            { $match: { userId: getObjectId(userId), entity: 'todo' } },
            {
                $lookup: {
                    from: TodoModel.modelName,
                    localField: 'entityId',
                    foreignField: '_id',
                    as: 'todoId',
                },
            },
            { $unwind: { path: '$todoId', preserveNullAndEmptyArrays: true } },
            { $match: filter },
        ];

        const [countResult, todos] = await Promise.all([
            PermissionModel.aggregate([...baseStages, { $count: 'total' }]),
            PermissionModel.aggregate([
                ...baseStages,
                { $skip: (pageNumber - 1) * pageSize },
                { $limit: pageSize },
                {
                    $project: {
                        __v: 0,
                        addedBy: 0,
                        userId: 0,
                        'todoId.__v': 0,
                    },
                },
            ]),
        ]);

        return { total: countResult[0]?.total ?? 0, todos };
    },
};

export default permissionRepository;
