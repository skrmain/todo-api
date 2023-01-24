import { Schema, model } from 'mongoose';

import { dbCollections } from '../../shared/constants';

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

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: String,
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
        description: String,
        image: String,
    },
    { timestamps: true }
);

export const Product = model(dbCollections.product, ProductSchema);
