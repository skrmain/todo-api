const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("./../models/User");
const checkAuth = require("./../middlewares/checkAuth");

// to REGISTER User
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.find({ email }).then(users => {
    if (users.length === 0) {
      let user1 = new User({ name, email, password });
      user1
        .save()
        .then(result => {
          res.json({ message: "Account Created" });
        })
        .catch(err => {
          console.log(err);
          res.status(404).json({ error: "Error Occured" });
        });
    } else {
      res.status(400).json({ error: "Invalid Email" });
    }
  });
});

// to LOGIN User
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password })
    .select("email name isSuperAdmin")
    .then(user => {
      if (user) {
        let userData = user._doc
        const token = jwt.sign(userData, "secret");
        res.json({ message: "Login Successfull", token: token, user: user });
      } else {
        res.status(400).json({ error: "Invalid Email or Password" });
      }
    })
    .catch(err => {
      res.status(404).json({ error: "Erorr Occured" });
    });
});

// to send USER Detail
router.get("/", checkAuth, (req, res) => {
  User.findById(req.user._id)
    .select("name email")
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(404).json({ error: "Error in Getting the User Information" });
    });
});

// to DELETE user Account
router.delete("/", checkAuth, (req, res) => {
  User.findByIdAndDelete(req.user._id)
    .then(result => {
      res.json({ message: "Account deleted" });
    })
    .catch(err => {
      res.status(401).json({ error: "Error Occurred" });
    });
});

module.exports = router;
