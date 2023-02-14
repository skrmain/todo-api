import { Product } from './models';

interface ProductFilter {
    _id?: string;
    name?: string;
}

const getOne = (filter: ProductFilter, select = '-__v') => Product.findOne(filter, select).lean();

const count = (filter: ProductFilter) => Product.count(filter).lean();

const exists = (filter: ProductFilter) => Product.exists(filter).lean();

const getAll = (filter: ProductFilter = {}, select = '-__v') => Product.find(filter, select).lean();

const create = (details: ProductFilter) => Product.create(details);

export default { getOne, getAll, create, count, exists };
