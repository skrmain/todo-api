import { Router } from "express";
import { checkAuth } from "../../shared/middleware";

import {
  AddProductController,
  GetProductByIdController,
  ProductListController,
} from "./controllers";

const router = Router();

router.get("/", ProductListController);
router.get("/:id", GetProductByIdController);
router.post("/", checkAuth, AddProductController);

export default router;
