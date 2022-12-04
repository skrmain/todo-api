const express = require("express");
const router = express.Router();

const Product = require("./../models/Product").Product;
const Brand = require("./../models/Product").Brand;
const Category = require("./../models/Product").Category;
const upload = require("../middlewares/imageUpload");
const checkAuth = require("./../middlewares/checkAuth");
const checkSuperAdmin = require("./../middlewares/checkSuperAdmin");

// all brands
router.get("/brands", (req, res) => {
  Brand.find({})
    .then(brands => {
      res.json({ brands: brands });
    })
    .catch(err => {
      console.log("Error : ", err.name);
      res.json({ error: "Error Occured" });
    });
});

// add Brand
router.post("/addbrand", (req, res) => {
  const { name } = req.body;
  let b1 = new Brand({
    name
  });

  b1.save()
    .then(result => {
      console.log("Result Brand : ", result);
      res.json({ msg: "Brand Added" });
    })
    .catch(err => {
      console.log("Error : ", err.name);
      res.json({ error: "Error Occured" });
    });
});

// all Category
router.get("/category", (req, res) => {
  Category.find({})
    .then(category => {
      res.json({ categories: category });
    })
    .catch(err => {
      console.log("Error : ", err.name);
      res.json({ error: "Error Occured" });
    });
});

// add Category
router.post("/addcategory", (req, res) => {
  const { name } = req.body;
  let c1 = new Category({
    name
  });

  c1.save()
    .then(result => {
      console.log("Result Category : ", result);
      res.json({ msg: "Category Added" });
    })
    .catch(err => {
      console.log("Error : ", err.name);
      res.json({ error: "Error Occured" });
    });
});

// to SEND ALL
router.get("/", (req, res) => {
  Product.find()
    .then(products => {
      res.json({ products: products });
    })
    .catch(err => {
      res.status(404).json({ error: "Error Occured" });
    });
});

// to SEND ONE
router.get("/detail/:productId", checkAuth, (req, res) => {
  let productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      res.json({
        product
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ error: "Error Occured" });
    });
});

// to ADD NEW
router.post(
  "/add",
  checkAuth,
  checkSuperAdmin,
  upload.single("image"),
  (req, res) => {
    const { name, company, category, price, description } = req.body;

    const image = req.file.filename;
    let product1 = new Product({
      name,
      price,
      company,
      category,
      description,
      image
    });

    product1
      .save()
      .then(result => {
        console.log(result);
        res.json({ message: "Data Saved to the DB" });
      })
      .catch(err => {
        res.status(404).json({ error: "Error occured" });
      });
  }
);

// // route to update
// router.put("/:productId", (req, res) => {
//   let productId = req.params.productId;
//   Product.findByIdAndUpdate(productId, { $set: req.body })
//     .then(result => {
//       res.json({ message: "Todo Updated" });
//     })
//     .catch(err => {
//       res.status(404).json({ error: "Erorr Occured" });
//     });
// });

// // route to delete
// router.delete("/:productId", (req, res) => {
//   let productId = req.params.productId;
//   Product.findByIdAndDelete(productId)
//     .then(result => {
//       res.json({ message: "Todo Deleted" });
//     })
//     .catch(err => {
//       res.status(404).json({ error: "Error Occured" });
//     });
// });

module.exports = router;
