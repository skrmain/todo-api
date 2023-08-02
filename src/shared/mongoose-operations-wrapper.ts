import { FilterQuery, Model, PipelineStage } from 'mongoose';

interface IQuery {
    limit: number;
    page: number;
    sortBy: string;
    sortOrder: 'desc' | 'asc';
}

export enum SortOrder {
    desc = -1,
    asc = 1,
}

export class MongooseOperationsWrapper<T> {
    private _model: Model<T>;
    constructor(model: Model<T>) {
        this._model = model;
    }

    getOne(filter: FilterQuery<T>, select = '') {
        return this._model.findOne(filter, select + ' -__v').lean();
    }

    count = (filter: FilterQuery<T>) => this._model.count(filter).lean();

    exists = (filter: FilterQuery<T>) => this._model.exists(filter).lean();

    getAll(filter: FilterQuery<T> = {}, select = '') {
        return this._model.find(filter, select + ' -__v').lean();
    }

    getWithQuery = (filter: FilterQuery<T> = {}, query: IQuery, select = '') => {
        return this._model
            .find(filter, select + ' -__v')
            .skip((query.page - 1) * query.limit)
            .limit(query.limit)
            .sort({
                [query.sortBy]: SortOrder[query.sortOrder],
            })
            .lean();
    };

    create = (details: FilterQuery<T>) => this._model.create(details);

    updateOne = (filter: FilterQuery<T>, details: object) => this._model.updateOne(filter, details).lean();

    deleteOne = (filter: FilterQuery<T>) => this._model.deleteOne(filter).lean();

    deleteMany(filter: any) {
        return this._model.deleteMany(filter).lean();
    }

    aggregate = (pipeline: PipelineStage[]) => this._model.aggregate<T>(pipeline);
}
