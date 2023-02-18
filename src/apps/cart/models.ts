import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';

interface IProductInfo {
    productId: Types.ObjectId;
    quantity: number;
    createdAt?: string;
    updatedAt?: string;
}

interface ICart {
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
        },
    },
    { timestamps: true }
);

const CartSchema: Schema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: dbCollections.user,
            required: true,
        },
        products: {
            type: [ProductInfoSchema],
        },
    },
    { timestamps: true }
);

export const Cart = model(dbCollections.cart, CartSchema);
