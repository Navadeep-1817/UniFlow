// Approval status middleware stub
// Checks that an admin or user has been approved

module.exports = function approvalMiddleware(req, res, next) {
  // Placeholder: check req.user.approved or lookup user status
  next();
};
