const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const autherHeader = req.headers.authorization;

  if (!autherHeader || !autherHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });

  const token = autherHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!reols.includes(req.user.rol))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
};
