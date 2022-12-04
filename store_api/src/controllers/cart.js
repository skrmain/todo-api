const express = require("express");
const router = express.Router();

const Cart = require("./../models/Cart");
const checkAuth = require("./../middlewares/checkAuth");

// sending the cart products
router.get("/", checkAuth, (req, res) => {
  const userId = req.user._id;

  Cart.findOne({ userId })
    .select("products")
    .populate("products.productId")
    .then(result => {
      if (result) {
        res.json({ cart: result.products });
      } else {
        res.json({ cart: [] });
      }
    })
    .catch(err => {
      res.status(401).json({ error: "Error Occurred" });
    });
});

// for adding the product to the cart
router.post("/add", checkAuth, (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  Cart.findOne({ userId })
    .then(result => {
      if (result) {
        // checking that the product is already available or not in the cart
        let isAlreadyAdded = !result.products.every((val, index, arr) => {
          return String(val.productId) !== String(productId);
        });
        if (isAlreadyAdded) {
          // If product present in the cart: increment the Quantity
          Cart.updateOne(
            { userId: userId, "products.productId": productId },
            { $inc: { "products.$.quantity": 1 } }
          )
            .then(result2 => {
              res.json({ message: "Update the Quantiry of the Product" });
            })
            .catch(err => {
              res.status(401).json({ error: "Error Occured" });
            });
        } else {
          // If product not present in the cart: then add new prduct to the cart
          Cart.updateOne(
            { userId },
            { $push: { products: { productId: productId, quantity: 1 } } }
          )
            .then(result2 => {
              res.json({ message: "New Product Added to the Cart" });
            })
            .catch(err2 => {
              res.status(401).json({ error: "Error Occured" });
            });
        }
      } else {
        // If user cart not maded: for adding the new user to cart
        let c1 = new Cart({
          userId,
          products: [{ productId, quantity: 1 }]
        });

        c1.save()
          .then(result2 => {
            res.json({ message: "Product Added to Cart" });
          })
          .catch(err => {
            res.status(401).json({ error: "Error Occured" });
          });
      }
    })
    .catch(err => {
      res.status(401).json({ error: "Error Occured" });
    });
});

// to decrement the cart value
router.post("/remove", checkAuth, (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  Cart.findOne(
    { userId },
    { _id: 0, products: { $elemMatch: { productId: productId } } }
  )
    .then(result => {
      let isLastQuantity = result.products[0].quantity === 1;
      if (isLastQuantity) {
        Cart.updateOne({ userId }, { $pull: { products: { productId } } })
          .then(result2 => {
            res.json({ message: "Cart Item Removed" });
          })
          .catch(err => {
            res.status(401).json({ error: "Error Occured" });
          });
      } else {
        Cart.updateOne(
          { userId: userId, "products.productId": productId },
          { $inc: { "products.$.quantity": -1 } }
        )
          .then(result2 => {
            res.json({ message: "Cart Product Quantity decresed" });
          })
          .catch(err => {
            res.status(401).json({ error: "Error Occured" });
          });
      }
    })
    .catch(err => {
      res.status(401).json({ error: "Error Occured" });
    });
});

// for emptying cart
router.delete("/empty", checkAuth, (req, res) => {
  const userId = req.user._id;

  Cart.deleteOne({ userId })
    .then(result => {
      res.json({ message: "Cart Emptied" });
    })
    .catch(err => {
      res.status(401).json({ error: "Error Occured" });
    });
});

module.exports = router;
