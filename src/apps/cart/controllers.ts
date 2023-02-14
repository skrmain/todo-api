import { Cart } from './models';

interface CartFilter {
    userId: string;
    'products.productId'?: string;
}

const getOne = (filter: CartFilter, select = '') => Cart.findOne(filter, `-__v ${select}`).lean();

const count = (filter: CartFilter) => Cart.count(filter).lean();

const exists = (filter: CartFilter) => Cart.exists(filter).lean();

const create = (details: CartFilter) => Cart.create(details);

const updateOne = (filter: CartFilter, details: object) => Cart.updateOne(filter, details).lean();

const deleteOne = (filter: CartFilter) => Cart.deleteOne(filter).lean();

export default { getOne, create, count, exists, updateOne, deleteOne };
