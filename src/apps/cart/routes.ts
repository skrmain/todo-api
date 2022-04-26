import { Router } from "express";
import { CartAddBodyValidator, checkAuth } from "../../middleware";

import {
  AddProductToCartController,
  CartProductListController,
  EmptyCartController,
  RemoveProductFromCartController,
} from "./controllers";

const router = Router();

router.get("/", checkAuth, CartProductListController);
router.post(
  "/add",
  checkAuth,
  CartAddBodyValidator,
  AddProductToCartController
);
router.post("/remove", checkAuth, RemoveProductFromCartController);
router.post("/empty", checkAuth, EmptyCartController);

export default router;
