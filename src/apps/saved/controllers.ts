import { SavedProduct } from './models';

interface SavedProductFilter {
    _id?: string;
    userId?: string;
    productId?: string;
}

const getOne = (filter: SavedProductFilter, select = '-__v') => SavedProduct.findOne(filter, select).lean();

const count = (filter: SavedProductFilter) => SavedProduct.count(filter).lean();

const exists = (filter: SavedProductFilter) => SavedProduct.exists(filter).lean();

const getAll = (filter: SavedProductFilter = {}, select = '-__v') => SavedProduct.find(filter, select).lean();

const create = (details: SavedProductFilter) => SavedProduct.create(details);

const deleteOne = (filter: SavedProductFilter) => SavedProduct.deleteOne(filter).lean();

export default { getOne, getAll, create, count, exists, deleteOne };
