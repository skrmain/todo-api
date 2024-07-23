import { FilterQuery, Model, PipelineStage, SortOrder } from 'mongoose';

interface IQuery {
    limit: number;
    page: number;
    sortBy: string;
    sortOrder: SortOrder;
    populateParams: {
        populate: string | string[];
        select: string;
    };
}

export class MongooseOperationsWrapper<T> {
    private _model: Model<T>;
    constructor(model: Model<T>) {
        this._model = model;
    }

    getOne(filter: FilterQuery<T>, select = '') {
        return this._model.findOne(filter, select + ' -__v').lean();
    }

    getMany(filter: FilterQuery<T>, select = '', options: Partial<IQuery> = {}) {
        const { limit, page, sortBy, sortOrder, populateParams } = options;

        const _query = this._model.find(filter, select + ' -__v');

        if (limit && page) {
            _query.skip((page - 1) * limit).limit(limit);
        }
        if (sortBy && sortOrder) {
            _query.sort({
                [sortBy]: sortOrder,
            });
        }
        if (populateParams?.populate || populateParams?.select) {
            _query.populate(populateParams.populate, populateParams.select);
        }

        return _query.lean().exec();
    }

    count = (filter: FilterQuery<T>) => this._model.count(filter).lean();

    exists = (filter: FilterQuery<T>) => this._model.exists(filter).lean();

    getAll(filter: FilterQuery<T> = {}, select = '') {
        return this._model.find(filter, select + ' -__v').lean();
    }

    create = (details: FilterQuery<T>) => this._model.create(details);

    updateOne = (filter: FilterQuery<T>, details: object) => this._model.updateOne(filter, details).lean();

    deleteOne = (filter: FilterQuery<T>) => this._model.deleteOne(filter).lean();

    deleteMany = (filter: any) => this._model.deleteMany(filter).lean();

    aggregate = (pipeline: PipelineStage[]) => this._model.aggregate<T>(pipeline);
}
