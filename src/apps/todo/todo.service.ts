import { DbCollections } from '../../common/constants';
import { MongooseOperationsWrapper } from '../../common/mongoose-operations-wrapper';
import { getObjectId } from '../../common/utils';
import permissionService from '../permission/permission.service';
import { TodoModel } from './todo.models';

class TodoService<T> extends MongooseOperationsWrapper<T> {
    async getUserTodos({ userId, filter, pageNumber, pageSize, sortOrder, sortBy }: any) {
        const baseStages: any = [
            { $match: { userId: getObjectId(userId), entity: 'todo' } },
            {
                $lookup: {
                    from: DbCollections.todo,
                    localField: 'entityId',
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
        const total = (await permissionService.aggregate(baseStages)).length;
        const todos = await permissionService.aggregate(paginatedStages);

        return { total, todos };
    }
}

export default new TodoService(TodoModel);
