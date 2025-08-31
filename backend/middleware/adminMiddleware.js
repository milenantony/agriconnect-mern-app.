// backend/middleware/adminMiddleware.js

const admin = (req, res, next) => {
  // We assume the 'protect' middleware has already run and added 'req.user'
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed to the next function (the controller)
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};

module.exports = { admin };