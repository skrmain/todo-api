import { Schema, model, Types } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { IBaseModel } from '../../shared/types';

export interface IProductImages {
    name: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

const ProductImagesSchema = new Schema<IProductImages>({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    buffer: {
        type: Buffer,
        required: true,
    },
});

export interface IProduct extends IBaseModel {
    name: string;
    price: number;
    brand: string;
    category: string;
    description?: string;
    images: IProductImages[];
    userId: any;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            trim: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        images: {
            type: [ProductImagesSchema],
        },
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: dbCollections.user,
        },
    },
    { timestamps: true }
);

export const ProductModel = model(dbCollections.product, ProductSchema);
