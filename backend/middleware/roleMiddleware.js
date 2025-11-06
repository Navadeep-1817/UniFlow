// Role-based access middleware stub
// TODO: implement hierarchical role checks using config/roles.js

module.exports = function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    // Placeholder: compare req.user.role vs requiredRole
    next();
  };
};
