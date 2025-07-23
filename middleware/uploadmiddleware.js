const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};



exports.isCandidate = (req, res, next) => {
  if (req.user && req.user.role === "candidate") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied: Candidates only" });
  }
};

exports.isCompany = (req, res, next) => {
  if (req.user && req.user.role === "company") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied: Companies only" });
  }
};

