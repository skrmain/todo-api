import { Schema, model, Types, PopulatedDoc, Document } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { IBaseModel } from '../../shared/types';
import { IProduct } from '../product/product.models';

interface ICartProductInfo extends IBaseModel {
    productId: PopulatedDoc<Document<Types.ObjectId> & IProduct>;
    quantity: number;
}

interface ICart extends IBaseModel {
    userId: Types.ObjectId;
    cartProducts: ICartProductInfo[];
}

const CartProductInfoSchema = new Schema<ICartProductInfo>(
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

const CartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: dbCollections.user,
            required: true,
        },
        cartProducts: {
            type: [CartProductInfoSchema],
        },
    },
    { timestamps: true }
);

export const CartModel = model(dbCollections.cart, CartSchema);
