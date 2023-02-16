import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';

const ProductInfoSchema = new Schema(
    {
        productId: {
            type: Types.ObjectId,
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

const OrderSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
        },
        products: [ProductInfoSchema],
    },
    { timestamps: true }
);

export const Order = model(dbCollections.order, OrderSchema);
