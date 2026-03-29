const jwt = require('jsonwebtoken');

// 1. Verify Token Middleware (For all logged-in users)
const protect = (req, res, next) => {
  let token;

  // Check if header contains Authorization Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: "Bearer <token_string>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user payload to request object
      req.user = decoded.user;
      
      next(); // Move to the next function/route
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Admin Only Middleware (Must be used AFTER 'protect')
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { protect, adminOnly };