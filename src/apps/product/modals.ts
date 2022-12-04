import { Schema, model } from "mongoose";

// const categorySchema = Schema({
//   name: {
//     type: String,
//     required: true
//   }
// });

// const brandSchema = Schema({
//   name: {
//     type: String,
//     required: true
//   }
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

export const Product = model("Product", ProductSchema);
