require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

// 1️. Verify JWT and attach user to req.user
exports.isAuthenticated = async (req, res, next) => {

  const authHeader = req.header("Authorization");
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token, authorization denied" });

  const token = authHeader.split(" ")[1];
  try {
    

    const decoded = jwt.verify(token, JWT_SECRET);
    // fetch user (optional: to get fresh role/name)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// 2️. Admin-only guard
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin resources only" });
  next();
};

// 3. Member-only guard (if you need it)
exports.isMember = (req, res, next) => {
  if (req.user.role !== "member")
    return res.status(403).json({ message: "Member resources only" });
  next();
};
