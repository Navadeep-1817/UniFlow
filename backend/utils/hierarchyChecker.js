// Verify role hierarchy utilities

const roles = require('../config/roles');

module.exports = {
  canAssignRole(assignerRole, targetRole) {
    // Placeholder: use roles hierarchy from config/roles.js
    // Assume roles is an array from highest to lowest
    const idxAssigner = roles.indexOf(assignerRole);
    const idxTarget = roles.indexOf(targetRole);
    return idxAssigner !== -1 && idxTarget !== -1 && idxAssigner <= idxTarget;
  }
};
