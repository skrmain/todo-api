import { ObjectId } from 'mongoose';

export interface IProductQuery {
    limit: number;
    page: number;
    search: string;
    sortBy: string;
    sortOrder: 'desc' | 'asc';
    category: string;
    brand: string;
}

export interface IProductFilter {
    _id: string | ObjectId;
}

export interface IProductIdParam {
    productId: string;
}

export interface IProductDetails {
    name: string;
    brand: string;
    category: string;
    description: string;
    price: number;
}
