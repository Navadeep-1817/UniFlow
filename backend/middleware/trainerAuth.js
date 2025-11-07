const jwt = require('jsonwebtoken');
const Trainer = require('../models/Trainer');
const asyncHandler = require('express-async-handler');

// Protect trainer routes
exports.protectTrainer = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get trainer from token
    req.trainer = await Trainer.findById(decoded.id)
      .populate('university', 'name code')
      .populate('department', 'name code');

    if (!req.trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    if (!req.trainer.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
});

// Check if trainer is verified
exports.requireVerified = asyncHandler(async (req, res, next) => {
  if (!req.trainer.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Your account is not verified yet. Please wait for admin approval.',
    });
  }
  next();
});
