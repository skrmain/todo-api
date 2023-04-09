import { Database } from '../../shared/database';

import { TodoSortByMapping, MongoSortOrder, dbCollections } from '../../shared/constants';
import { getObjectId } from '../../shared/utils';
import { UserTodoModel } from './model';

class UserTodoService<T> extends Database<T> {
    /**
     * To get user Todos with Pagination, filter, sorting
     */
    async getUserTodos({ userId, filter, pageNumber, pageSize, sortOrder, sortBy }: any) {
        const baseStages: any = [
            { $match: { userId: getObjectId(userId) } },
            {
                $lookup: {
                    from: dbCollections.note,
                    localField: 'todoId',
                    foreignField: '_id',
                    as: 'todoId',
                },
            },
            { $unwind: { path: '$todoId', preserveNullAndEmptyArrays: true } },
            { $match: filter },
        ];

        const paginatedStages = baseStages.concat([
            // { $sort: { [TodoSortByMapping[sortBy]]: MongoSortOrder[sortOrder] } },
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
        ]);
        const total = (await this.aggregate(baseStages)).length;
        const todos = await this.aggregate(paginatedStages);

        return { total, todos };
    }
}

export default new UserTodoService(UserTodoModel);
