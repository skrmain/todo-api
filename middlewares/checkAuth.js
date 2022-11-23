const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    req.user = jwt.verify(token, "secret");
    next();
  } catch (err) {
    console.log("Error in Auth");
    res.status(401).json({ error: "Auth Error Occured" });
  }
};
