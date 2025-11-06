const { ROLES, canAccessResource, hasPermission } = require('../config/roles');

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Check if user has specific permission
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

// Super Admin only
exports.superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin only.',
    });
  }
  next();
};

// Academic Admin only (HOD or TP)
exports.academicAdminOnly = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== ROLES.ACADEMIC_ADMIN_HOD &&
      req.user.role !== ROLES.ACADEMIC_ADMIN_TP &&
      req.user.role !== ROLES.SUPER_ADMIN)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Academic Admin only.',
    });
  }
  next();
};

// Non-Academic Admin only
exports.nonAcademicAdminOnly = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== ROLES.NON_ACADEMIC_FACULTY_HEAD &&
      req.user.role !== ROLES.NON_ACADEMIC_TEAM_REP &&
      req.user.role !== ROLES.SUPER_ADMIN)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Non-Academic Admin only.',
    });
  }
  next();
};

// Faculty Head only
exports.facultyHeadOnly = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== ROLES.NON_ACADEMIC_FACULTY_HEAD &&
      req.user.role !== ROLES.SUPER_ADMIN)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Faculty Head only.',
    });
  }
  next();
};

// Check if user is approved
exports.checkApprovalStatus = (req, res, next) => {
  if (req.user.role !== ROLES.SUPER_ADMIN && !req.user.isApproved) {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval',
    });
  }
  next();
};