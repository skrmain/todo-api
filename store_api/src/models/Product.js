const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  brand: {
    type: mongoose.ObjectId,
    ref: "Brand",
    required: true
  },
  category: {
    type: mongoose.ObjectId,
    ref: "Category",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const Category = mongoose.model("Category", categorySchema);
const Brand = mongoose.model("Brand", brandSchema);
const Product = mongoose.model("Product", productSchema);

module.exports = {
  Category: Category,
  Brand: Brand,
  Product: Product
};
