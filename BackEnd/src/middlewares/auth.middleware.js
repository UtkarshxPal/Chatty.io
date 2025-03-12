const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function protectedRoute(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in Protected Route middleware");
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { protectedRoute };
