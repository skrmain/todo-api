/* eslint-disable object-curly-newline */
const Database = require('../../shared/database');
const UserTodoModel = require('./model');

const { ModelNames, TodoSortByMapping, MongoSortOrder } = require('../../shared/constants');
const { MongoDBObjectId } = require('../../shared/utils');

class UserTodoService extends Database {
    /**
     * To get user Todos with Pagination, filter, sorting
     */
    async getUserTodos({ userId, filter, pageNumber, pageSize, sortOrder, sortBy }) {
        const baseStages = [
            { $match: { userId: MongoDBObjectId(userId) } },
            {
                $lookup: {
                    from: ModelNames.todo,
                    localField: 'todoId',
                    foreignField: '_id',
                    as: 'todoId',
                },
            },
            { $unwind: { path: '$todoId', preserveNullAndEmptyArrays: true } },
            { $match: filter },
        ];

        const paginatedStages = baseStages.concat([
            { $sort: { [TodoSortByMapping[sortBy]]: MongoSortOrder[sortOrder] } },
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

const userTodoService = new UserTodoService(UserTodoModel);

module.exports = userTodoService;
