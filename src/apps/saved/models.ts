import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';

const SavedProductSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
        },
        productId: {
            type: Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

export const SavedProduct = model(dbCollections.savedProducts, SavedProductSchema);
