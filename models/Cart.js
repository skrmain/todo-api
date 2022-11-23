const mongoose = require("mongoose");

const productInfoSchema = mongoose.Schema({
  productId: {
    type: mongoose.ObjectId,
    ref: "Product"
  },
  quantity: Number
});

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true
  },
  products: [productInfoSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
