import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';

interface IProductInfo {
    productId: Types.ObjectId;
    quantity: number;
    total: number;
    createdAt?: string;
    updatedAt?: string;
}

interface IOrder {
    userId: Types.ObjectId;
    products: IProductInfo[];
    createdAt?: string;
    updatedAt?: string;
}

const ProductInfoSchema = new Schema<IProductInfo>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: dbCollections.product,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const OrderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: dbCollections.user,
        },
        products: [ProductInfoSchema],
    },
    { timestamps: true }
);

export const Order = model(dbCollections.order, OrderSchema);
