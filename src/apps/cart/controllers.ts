import { validationResult } from "express-validator";

import { MyRequest, MyResponse } from "../../shared/types";
import { sendFailResponse, sendSuccessResponse } from "../../utils";
import { Cart as CartModal } from "./modals";
import { Product as ProductModel } from "./../product/modals";

export const CartProductListController = async (
  req: MyRequest,
  res: MyResponse
) => {
  try {
    const cartProducts = await CartModal.findOne({ user: req.user?._id })
      .select("products")
      .populate("products.product");

    sendSuccessResponse(res, {
      message: "Successful",
      data: { cart: cartProducts || { products: [] }, user: req.user },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Failed to send Cart Products",
    });
  }
};

export const AddProductToCartController = async (
  req: MyRequest,
  res: MyResponse
) => {
  try {
    // 1. Validating the request body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendFailResponse(res, { errors: errors.array() });
    }

    // 2. To check if product exists in DB
    const { product } = req.body;
    const productExists = await ProductModel.exists({ _id: product });
    if (!productExists) {
      throw new Error("Product unavailable.");
    }

    // 3. Checking if cart already exists
    const user = req.user?._id;
    const userCartExists = (await CartModal.find({ user }).countDocuments()) > 0;

    if (!userCartExists) {
      const result = await CartModal.create({
        user,
        products: [{ product, quantity: 1 }],
      });
      const cartProduct = result.toJSON();

      return sendSuccessResponse(res, {
        message: "Product added to cart",
        data: { cart: cartProduct },
      });
    }

    // 4. Checking if Product is already available in cart
    const productExistsInCart = (await CartModal.find({ user }).find({"products.product": product}).countDocuments()) <= 0;

    // 4.1 - If Product is not available in cart
    if (productExistsInCart) {
      const result = await CartModal.updateOne(
        { user },
        { $push: { products: { product, quantity: 1 } } }
      );

      return sendSuccessResponse(res, {
        message: "Added Product to Cart",
        data: { cart: result },
      });
    }

    // 4.2 - If product is already available in cart
    const cartProduct = await CartModal.updateOne(
      { user, "products.product": product },
      { $inc: { "products.$.quantity": 1 } }
    );

    sendSuccessResponse(res, {
      message: "Updated Product Quantity",
      data: { cart: cartProduct },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
    });
  }
};

export const RemoveProductFromCartController = async (
  req: MyRequest,
  res: MyResponse
) => {
  try {
    const { product } = req.body;
    const user = req.user?._id;
    let cartProduct;
    let message = "";

    const quantityCount = await CartModal.find({
      user,
      "products.product": product,
    });

    if (quantityCount.length === 0) {
      message = "Product not in Cart";
    } else if (quantityCount.length > 0) {
      const productQuantity = quantityCount[0].products[0].quantity;

      if (productQuantity === 1) {
        cartProduct = await CartModal.updateOne(
          { user },
          { $pull: { products: { product } } }
        );
        message = "Removed Product from Cart";
      } else if (productQuantity > 1) {
        cartProduct = await CartModal.updateOne(
          { user, "products.product": product },
          { $inc: { "products.$.quantity": -1 } }
        );
        message = "Decreased Product Quantity";
      }
    }

    sendSuccessResponse(res, {
      message: message,
      data: { cart: cartProduct },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Failed to send Cart Products",
    });
  }
};

export const EmptyCartController = async (req: MyRequest, res: MyResponse) => {
  try {
    const user = req.user?._id;
    const response = await CartModal.deleteOne({ user });

    sendSuccessResponse(res, {
      message: "Cart Emptied",
      data: { response },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Failed to send Cart Products",
    });
  }
};
