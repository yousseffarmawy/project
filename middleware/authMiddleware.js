const jwt = require('jsonwebtoken');
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

const companyOnly = (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.status(403).json({ message: 'Only companies can perform this action' });
  }
  next();
};

module.exports = { protect, companyOnly };
