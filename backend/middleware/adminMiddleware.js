const admin = (req, res, next) => {
  // We check if the user exists AND if their role, converted to lowercase, is 'admin'.
  // This is the crucial fix.
  if (req.user && req.user.role.toLowerCase() === 'admin') {
    next(); // User is an admin, proceed.
  } else {
    // If not, send a "Forbidden" status.
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { admin };
