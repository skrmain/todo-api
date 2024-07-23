import { dbCollections } from '../../shared/constants';
import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';
import { getObjectId } from '../../shared/utils';
import permissionService from '../permission/permission.service';
import { NoteModel } from './todo.models';

class NoteService<T> extends MongooseOperationsWrapper<T> {
    async getUserNotes({ userId, filter, pageNumber, pageSize, sortOrder, sortBy }: any) {
        const baseStages: any = [
            { $match: { userId: getObjectId(userId), entity: 'note' } },
            {
                $lookup: {
                    from: dbCollections.todo,
                    localField: 'entityId',
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
        const total = (await permissionService.aggregate(baseStages)).length;
        const notes = await permissionService.aggregate(paginatedStages);

        return { total, notes };
    }
}

export default new NoteService(NoteModel);
