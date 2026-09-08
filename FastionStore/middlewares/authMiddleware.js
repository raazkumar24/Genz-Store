import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'genz-store-dev-jwt-secret-2026';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No auth header — guest user (cart routes still work for guests via x-guest-id)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const guestId = req.headers['x-guest-id'] || `guest_${Date.now()}`;
    req.user = { id: guestId, role: 'guest' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined' || token === '') {
    const guestId = req.headers['x-guest-id'] || `guest_${Date.now()}`;
    req.user = { id: guestId, role: 'guest' };
    return next();
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    // Invalid/expired token — reject with 401 for protected routes
    return res.status(401).json({ 
      message: "Invalid or expired token. Please login again." 
    });
  }
};

export default authMiddleware;
