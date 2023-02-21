import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { IBaseModel } from '../../shared/types';

interface IProductInfo extends IBaseModel {
    productId: Types.ObjectId;
    quantity: number;
}

interface ICart extends IBaseModel {
    userId: Types.ObjectId;
    products: IProductInfo[];
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
