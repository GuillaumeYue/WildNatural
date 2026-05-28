const jwt = require('jsonwebtoken');

// Verify if the user is logged in
const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // JWT is signed with { id: user._id }. Expose both `id` and `_id`
    // so controllers using either convention work.
    req.user = { ...decoded, _id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Verify if the user is an Admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, adminOnly };