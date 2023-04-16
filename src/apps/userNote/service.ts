import { Database } from '../../shared/database';

import { NoteSortByMapping, MongoSortOrder, dbCollections } from '../../shared/constants';
import { getObjectId } from '../../shared/utils';
import { UserNoteModel } from './model';

class UserNoteService<T> extends Database<T> {
    /**
     * To get user Notes with Pagination, filter, sorting
     */
    async getUserNotes({ userId, filter, pageNumber, pageSize, sortOrder, sortBy }: any) {
        const baseStages: any = [
            { $match: { userId: getObjectId(userId) } },
            {
                $lookup: {
                    from: dbCollections.note,
                    localField: 'noteId',
                    foreignField: '_id',
                    as: 'noteId',
                },
            },
            { $unwind: { path: '$noteId', preserveNullAndEmptyArrays: true } },
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
                    'noteId.__v': 0,
                },
            },
        ]);
        const total = (await this.aggregate(baseStages)).length;
        const notes = await this.aggregate(paginatedStages);

        return { total, notes };
    }
}

export default new UserNoteService(UserNoteModel);
