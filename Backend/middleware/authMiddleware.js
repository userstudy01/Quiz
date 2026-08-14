const jwt = require('jsonwebtoken');

// 1. Verify Token Middleware (any authenticated user)
const protect = (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};

// 2. Admin Only Middleware (must run AFTER `protect`)
// Superadmin is a higher role and passes every admin check.
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
};

// 3. Super Admin Only Middleware (approving/managing other users)
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
};

module.exports = { protect, adminOnly, superAdminOnly };
