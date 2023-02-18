import { FilterQuery, Model } from 'mongoose';

export class DbController<T> {
    private model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }

    getOne = (filter: FilterQuery<T>, select = '-__v') => this.model.findOne(filter, select).lean();

    count = (filter: FilterQuery<T>) => this.model.count(filter).lean();

    exists = (filter: FilterQuery<T>) => this.model.exists(filter).lean();

    getAll = (filter: FilterQuery<T> = {}, select = '-__v') => this.model.find(filter, select).lean();

    create = (details: FilterQuery<T>) => this.model.create(details);

    updateOne = (filter: FilterQuery<T>, details: object) => this.model.updateOne(filter, details).lean();

    deleteOne = (filter: FilterQuery<T>) => this.model.deleteOne(filter).lean();
}
