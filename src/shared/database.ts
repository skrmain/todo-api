import { FilterQuery, Model, PipelineStage, connect } from 'mongoose';
import logger from './logger';

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

export class Database<T> {
    private model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }

    static async connect(uri: string) {
        try {
            const con = await connect(uri, { dbName: 'test' });
            logger.verbose(`⚡️[MongoDB] Connected to '${con.connection.name}' DB`);
        } catch (error) {
            logger.error('[MongoDB] Error 🙈 ', { error });
            process.exit(1);
        }
    }

    getOne(filter: FilterQuery<T>, select = '') {
        return this.model.findOne(filter, select + ' -__v').lean();
    }

    count = (filter: FilterQuery<T>) => this.model.count(filter).lean();

    exists = (filter: FilterQuery<T>) => this.model.exists(filter).lean();

    getAll(filter: FilterQuery<T> = {}, select = '') {
        return this.model.find(filter, select + ' -__v').lean();
    }

    getWithQuery = (filter: FilterQuery<T> = {}, query: IQuery, select = '') => {
        return this.model
            .find(filter, select + ' -__v')
            .skip((query.page - 1) * query.limit)
            .limit(query.limit)
            .sort({
                [query.sortBy]: SortOrder[query.sortOrder],
            })
            .lean();
    };

    create = (details: FilterQuery<T>) => this.model.create(details);

    updateOne = (filter: FilterQuery<T>, details: object) => this.model.updateOne(filter, details).lean();

    deleteOne = (filter: FilterQuery<T>) => this.model.deleteOne(filter).lean();

    deleteMany(filter: any) {
        return this.model.deleteMany(filter).lean();
    }

    aggregate = (pipeline: PipelineStage[]) => this.model.aggregate<T>(pipeline);
}
