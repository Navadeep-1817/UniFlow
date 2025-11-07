const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, department, isActive, isApproved, search } = req.query;
  
  const filter = {};
  if (role) filter.role = role;
  if (department) filter.department = department;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .populate('university', 'name')
    .populate('department', 'name')
    .populate('studentBody', 'name')
    .sort('-createdAt');

  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('university', 'name location')
    .populate('department', 'name code')
    .populate('studentBody', 'name type');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('university', 'name location')
    .populate('department', 'name code')
    .populate('studentBody', 'name type');

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  // Fields that can be updated by user themselves
  const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'gender', 'address'];
  
  const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow updating password through this route
  delete req.body.password;
  
  // Super admin can update any field except password
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE_USER',
    actionDescription: `Updated user: ${updatedUser.name} (${updatedUser.email})`,
    module: 'User',
    targetId: updatedUser._id,
    targetModel: 'User',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'MEDIUM',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Super Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow deleting super admin
  if (user.role === ROLES.SUPER_ADMIN) {
    res.status(403);
    throw new Error('Cannot delete super admin');
  }

  await user.deleteOne();

  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'DELETE_USER',
    actionDescription: `Deleted user: ${user.name} (${user.email})`,
    module: 'User',
    targetId: user._id,
    targetModel: 'User',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'HIGH',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Update password
// @route   PUT /api/users/me/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const user = await User.findById(req.user._id);

  // Check current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  await AuditLog.log({
    userId: user._id,
    userName: user.name,
    userRole: user.role,
    userEmail: user.email,
    action: 'UPDATE_PASSWORD',
    actionDescription: 'User changed their password',
    module: 'User',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'MEDIUM',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Upload profile picture
// @route   POST /api/users/me/profile-picture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  // This would require multer/cloudinary setup
  // For now, accept a URL
  const { profilePicture } = req.body;

  if (!profilePicture) {
    res.status(400);
    throw new Error('Please provide profile picture URL');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile picture updated successfully',
    data: user
  });
});

module.exports = {
  getAllUsers,
  getUser,
  getMyProfile,
  updateProfile,
  updateUser,
  deleteUser,
  updatePassword,
  uploadProfilePicture
};
