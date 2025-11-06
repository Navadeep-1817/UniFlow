// Request validation middleware stub
// Use with validators from utils/validators.js

module.exports = function validateRequest(schema) {
  return (req, res, next) => {
    // Placeholder: validate req.body against schema
    next();
  };
};
