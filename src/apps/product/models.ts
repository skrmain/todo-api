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

interface IProduct {
    name: string;
    price: number;
    brand: string;
    category: string;
    description: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
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
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Product = model(dbCollections.product, ProductSchema);
