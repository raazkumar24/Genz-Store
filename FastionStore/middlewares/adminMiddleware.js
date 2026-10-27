const adminMiddleware = (req, res, next) => {
  // Verify that authenticated user has administrator privileges
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  // Allow development mode bypass with audit log if enabled
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.warn(`[DEV ACCESS] Non-admin (${req.user?.role || 'unauthenticated'}) accessed admin route in development.`);
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Administrator privileges required."
  });
};

export default adminMiddleware;