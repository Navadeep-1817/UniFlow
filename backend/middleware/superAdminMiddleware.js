// Super-admin only routes middleware stub

module.exports = function superAdminMiddleware(req, res, next) {
  // Placeholder: ensure req.user.role === 'superAdmin'
  next();
};
