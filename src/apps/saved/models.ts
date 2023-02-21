import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { IBaseModel } from '../../shared/types';

interface ISavedProduct extends IBaseModel {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
}

const SavedProductSchema = new Schema<ISavedProduct>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: dbCollections.user,
        },
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: dbCollections.product,
        },
    },
    { timestamps: true }
);

export const SavedProduct = model(dbCollections.savedProduct, SavedProductSchema);
