import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import UserRoutes from "./apps/user/routes";
import ProductRoutes from "./apps/product/routes";
import CartRoutes from "./apps/cart/routes";
import dotenv from "dotenv";
import { MONGODB_URL } from "./constants";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

const connectDB = async () => {
  try {
    const con = await mongoose.connect(MONGODB_URL, {
      dbName: "test",
    });
    console.log(`⚡️[MongoDB] Connected to '${con.connection.name}' DB`);
  } catch (err: any) {
    console.log("[MongoDB] Error : ", err.message);
    process.exit(0);
  }
};

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url, res.statusCode);
  next();
});

app.get("/", (req, res) => res.send({ status: "Active⚡" }));

app.use("/user", UserRoutes);
app.use("/product", ProductRoutes);
app.use("/cart", CartRoutes);

app.use("/images", express.static("images"));

app.use((req, res) => {
  res.status(404).send({
    message: "Invalid Path. This path does not Exists",
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[NODE_ENV]: ${process.env.NODE_ENV}`);
  console.log(`⚡️[Server]: Listening at ${PORT}`);
});
