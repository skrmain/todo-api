import { Schema, model, Types, PopulatedDoc, Document } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { IBaseModel } from '../../shared/types';
import { IProduct } from '../product/product.models';

interface IOrderProductInfo extends IBaseModel {
    productId: PopulatedDoc<Document<Types.ObjectId> & IProduct>;
    price: number;
    quantity: number;
}

export interface IOrder extends IBaseModel {
    userId: Types.ObjectId;
    orderedProducts: IOrderProductInfo[];
    // total: number;
}

const OrderProductInfoSchema = new Schema<IOrderProductInfo>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: dbCollections.product,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
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
        orderedProducts: [OrderProductInfoSchema],
        // total: {
        //     type: Number,
        //     required: true,
        // },
    },
    { timestamps: true }
);

export const OrderModel = model(dbCollections.order, OrderSchema);
