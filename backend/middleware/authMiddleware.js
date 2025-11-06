// JWT verification middleware stub
// TODO: implement JWT verification using config/jwt.js

module.exports = function authMiddleware(req, res, next) {
  // Placeholder: extract token and verify
  // If verified, set req.user = { id, role, ... }
  // else return res.status(401).json({ message: 'Unauthorized' })
  next();
};
