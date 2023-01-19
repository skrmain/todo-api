import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';

const ProductInfoSchema = new Schema(
    {
        productId: {
            type: Types.ObjectId,
            ref: dbCollections.product,
            required: true,
        },
        quantity: Number,
    },
    { timestamps: true }
);

const CartSchema: Schema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: dbCollections.user,
            required: true,
        },
        products: [ProductInfoSchema],
    },
    { timestamps: true }
);

export const Cart = model(dbCollections.cart, CartSchema);
