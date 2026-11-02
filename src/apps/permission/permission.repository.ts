import { PipelineStage, Types, UpdateQuery } from 'mongoose';

import { getObjectId } from '../../common/utils.js';
import { TodoModel } from '../todo/todo.models.js';
import { Permission, PermissionModel, Permissions } from './permission.models.js';

type PermissionFilter = Omit<Partial<Permission>, 'permissions'> & {
    _id?: Types.ObjectId | string;
    permissions?: Permissions[] | { $in: Permissions[] };
};

type UserTodosQuery = {
    userId?: string;
    filter: Record<string, unknown>;
    pageNumber: number;
    pageSize: number;
};

const permissionRepository = {
    getOne(filter: PermissionFilter, select = '') {
        return PermissionModel.findOne(filter, `${select} -__v`).lean();
    },

    exists(filter: PermissionFilter) {
        return PermissionModel.exists(filter).lean();
    },

    create(details: Partial<Permission>) {
        return PermissionModel.create(details);
    },

    updateOne(filter: PermissionFilter, update: UpdateQuery<Permission>) {
        return PermissionModel.updateOne(filter, update).lean();
    },

    deleteOne(filter: PermissionFilter) {
        return PermissionModel.deleteOne(filter).lean();
    },

    deleteMany(filter: PermissionFilter) {
        return PermissionModel.deleteMany(filter).lean();
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
