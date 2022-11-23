const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method, req.url, res.statusCode);
  next();
});

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(err => {
    console.log("DB not Connected");
    process.exit();
  });

app.use("/images/", express.static("uploads"));

app.use("/user", require("./controllers/user"));
app.use("/products", require("./controllers/product"));
app.use("/cart", require("./controllers/cart"));

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(3000, () => {
  console.log("Serving on 3000");
});
