module.exports = (req, res, next) => {
  if (String(req.user.isSuperAdmin) === "true") {
    next();
  } else {
    return res.status(401).json({ error: "Access Denied" });
  }
};
