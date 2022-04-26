import { Request, Response } from "express";
import { sendFailResponse, sendSuccessResponse } from "../../utils";

import { Product as ProductModal } from "./modals";

export const ProductListController = async (req: Request, res: Response) => {
  try {
    const products = await ProductModal.find({});
    sendSuccessResponse(res, { data: { products: products } });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Failed to send Products",
    });
  }
};

export const GetProductByIdController = async (req: Request, res: Response) => {
  try {
    const productID = req.params.id?.toString() || "0";
    const product = await ProductModal.findById(productID);

    if (!product) {
      throw new Error("Product does not exists.");
    }

    sendSuccessResponse(res, {
      message: "Successful",
      data: { product: product },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
    });
  }
};

export const AddProductController = async (req: Request, res: Response) => {
  try {
    const productExists =
      (await ProductModal.find({ name: req.body.name }).countDocuments()) > 0;
    if (productExists) {
      throw new Error("Product with same name already exists.");
    }

    const addedProduct = (
      await ProductModal.create({
        ...req.body,
      })
    ).toJSON();

    sendSuccessResponse(res, {
      message: "Successful Added Product",
      data: { product: addedProduct },
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.message,
      message: "Failed to Add Products",
    });
  }
};
