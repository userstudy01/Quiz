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

// 2. Staff Only Middleware (must run AFTER `protect`)
// Content management (projects, skills, experience, profile, messages) is open
// to every approved staff role: editor, admin and superadmin.
const staffOnly = (req, res, next) => {
  const staffRoles = ['editor', 'admin', 'superadmin'];
  if (req.user && staffRoles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Staff privileges required.' });
};

// 3. Admin Only Middleware (must run AFTER `protect`)
// Higher-trust areas (analytics) require admin or superadmin — editors are excluded.
// Superadmin is a higher role and passes every admin check.
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
};

// 4. Super Admin Only Middleware (approving/managing other users)
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
};

module.exports = { protect, staffOnly, adminOnly, superAdminOnly };
