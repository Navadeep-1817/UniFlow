// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Protect routes - verify JWT token
// exports.protect = async (req, res, next) => {
//   let token;

//   // Check for token in headers
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   // Check if token exists
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized to access this route. Please login.',
//     });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Get user from token
//     req.user = await User.findById(decoded.id).select('-password');

//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found. Token is invalid.',
//       });
//     }

//     // Check if user is approved (except for super admin)
//     if (req.user.role !== 'superadmin' && !req.user.isApproved) {
//       return res.status(403).json({
//         success: false,
//         message: 'Your account is pending approval. Please wait for admin approval.',
//       });
//     }

//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized. Invalid token.',
//     });
//   }
// };

// // Generate JWT token
// exports.generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '7d',
//   });
// };

// // Send token response
// exports.sendTokenResponse = (user, statusCode, res, message = 'Success') => {
//   // Create token
//   const token = exports.generateToken(user._id);

//   // Remove password from output
//   user.password = undefined;

//   res.status(statusCode).json({
//     success: true,
//     message,
//     token,
//     user,
//   });
// };
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLE_HIERARCHY, hasPermission } = require('../config/roles');// Protect routes - verify token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
if (
  req.headers.authorization &&
  req.headers.authorization.startsWith('Bearer')
) {
  token = req.headers.authorization.split(' ')[1];
}
// Check for token in cookies
else if (req.cookies.token) {
  token = req.cookies.token;
}// Make sure token exists
if (!token) {
  return res.status(401).json({
    success: false,
    message: 'Not authorized to access this route',
  });
}try {
  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Get user from token
  req.user = await User.findById(decoded.id)
    .populate('university', 'name')
    .populate('department', 'name')
    .populate('studentBody', 'name');  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User no longer exists',
    });
  }  // Check if user is active
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated',
    });
  }  // Check if user is approved
  if (!req.user.isApproved) {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval',
    });
  }  // Check if user changed password after token was issued
  if (req.user.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      success: false,
      message: 'User recently changed password. Please log in again',
    });
  }  next();
} catch (err) {
  return res.status(401).json({
    success: false,
    message: 'Not authorized to access this route',
  });
}
} catch (error) {
console.error('Auth middleware error:', error);
res.status(500).json({
success: false,
message: 'Server error in authentication',
error: error.message,
});
}
};// Grant access to specific roles
exports.authorize = (...roles) => {
return (req, res, next) => {
if (!roles.includes(req.user.role)) {
return res.status(403).json({
success: false,
message: `User role '${req.user.role}' is not authorized to access this resource`,
});
}
next();
};
};// Check specific permission
exports.checkPermission = (permission) => {
return (req, res, next) => {
if (!hasPermission(req.user.role, permission)) {
return res.status(403).json({
success: false,
message: 'You do not have permission to perform this action',
});
}
next();
};
};// Check if user can access resource based on hierarchy
exports.canAccessResource = (requiredRole) => {
return (req, res, next) => {
const userLevel = ROLE_HIERARCHY[req.user.role];
const requiredLevel = ROLE_HIERARCHY[requiredRole];if (userLevel < requiredLevel) {
  return res.status(403).json({
    success: false,
    message: 'Insufficient privileges to access this resource',
  });
}
next();
};
};// Ownership check - user can only access their own resources
exports.isOwner = (resourceUserField = 'userId') => {
return (req, res, next) => {
// Super admin can access everything
if (req.user.role === 'superadmin') {
return next();
}// Check if the resource belongs to the user
if (req.resource && req.resource[resourceUserField]) {
  if (req.resource[resourceUserField].toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
}next();
};
};// Department check - user can only access resources in their department
exports.sameDepartment = async (req, res, next) => {
try {
if (req.user.role === 'superadmin') {
return next();
}if (!req.user.department) {
  return res.status(403).json({
    success: false,
    message: 'User does not belong to any department',
  });
}// The specific resource check should be done in the controller
next();
} catch (error) {
res.status(500).json({
success: false,
message: 'Error checking department access',
error: error.message,
});
}
};