import { Order } from './models';

interface OrderFilter {
    _id?: string;
    userId?: string;
    productId?: string;
}

interface ProductInfo {
    productId: string;
    quantity: number;
    total: number;
}

interface OrderCreateDetails {
    userId: string;
    products: ProductInfo[];
}

const getOne = (filter: OrderFilter, select = '-__v') => Order.findOne(filter, select).lean();

const count = (filter: OrderFilter) => Order.count(filter).lean();

const exists = (filter: OrderFilter) => Order.exists(filter).lean();

const getAll = (filter: OrderFilter = {}, select = '-__v') => Order.find(filter, select).lean();

const create = (details: OrderCreateDetails) => Order.create(details);

const deleteOne = (filter: OrderFilter) => Order.deleteOne(filter).lean();

export default { getOne, getAll, create, count, exists, deleteOne };
