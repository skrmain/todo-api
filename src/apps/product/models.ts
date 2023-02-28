import { Schema, model } from 'mongoose';

import { dbCollections } from '../../shared/constants';
import { IBaseModel } from '../../shared/types';

// const categorySchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//     },
// });

// const brandSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//     },
// });

export interface IProductImages {
    // storedName: string;
    // storedPath: string;
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
    },
    { timestamps: true }
);

export const Product = model(dbCollections.product, ProductSchema);
