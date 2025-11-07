// ============================================
// ACADEMIC ADMIN CONTROLLER - FIXED & STABLE
// ============================================

const AcademicAdmin = require('../models/AcademicAdmin');
const User = require('../models/User');
const Department = require('../models/Department');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// @desc    Get academic admin dashboard data
// @route   GET /api/academic/dashboard
// @access  Private (Academic Admin)
const getDashboard = asyncHandler(async (req, res) => {
  const academicAdmin = await AcademicAdmin.findOne({ userId: req.user._id })
    .populate('department', 'name code')
    .populate('userId', 'name email');

  if (!academicAdmin) {
    res.status(404);
    throw new Error('Academic admin profile not found');
  }

  // Get statistics safely using Promise.all
  const [totalEvents, upcomingEvents, departmentFaculty, departmentStudents] = await Promise.all([
    Event.countDocuments({
      department: academicAdmin.department,
    }).catch(() => 0),
    Event.countDocuments({
      department: academicAdmin.department,
      status: 'Upcoming',
    }).catch(() => 0),
    User.countDocuments({
      department: academicAdmin.department,
      role: ROLES.FACULTY,
      isActive: true,
    }).catch(() => 0),
    User.countDocuments({
      department: academicAdmin.department,
      role: ROLES.STUDENT,
      isActive: true,
    }).catch(() => 0),
  ]);

  res.status(200).json({
    success: true,
    data: {
      profile: academicAdmin,
      stats: {
        totalEvents,
        upcomingEvents,
        departmentFaculty,
        departmentStudents,
      },
    },
  });
});

// @desc    Get academic admin profile
// @route   GET /api/academic/profile
// @access  Private (Academic Admin)
const getProfile = asyncHandler(async (req, res) => {
  const academicAdmin = await AcademicAdmin.findOne({ userId: req.user._id })
    .populate('department', 'name code')
    .populate('userId', 'name email phone')
    .populate('approvedBy', 'name email');

  if (!academicAdmin) {
    res.status(404);
    throw new Error('Academic admin profile not found');
  }

  res.status(200).json({
    success: true,
    data: academicAdmin,
  });
});

// @desc    Update academic admin profile
// @route   PUT /api/academic/profile
// @access  Private (Academic Admin)
const updateProfile = asyncHandler(async (req, res) => {
  const { specialization, experience, qualification, permissions } = req.body;

  const academicAdmin = await AcademicAdmin.findOne({ userId: req.user._id });
  if (!academicAdmin) {
    res.status(404);
    throw new Error('Academic admin profile not found');
  }

  const changes = [];

  // Track changes and update fields
  if (specialization !== undefined) {
    changes.push({
      field: 'specialization',
      oldValue: academicAdmin.specialization,
      newValue: specialization,
    });
    academicAdmin.specialization = specialization;
  }

  if (experience !== undefined) {
    changes.push({
      field: 'experience',
      oldValue: academicAdmin.experience,
      newValue: experience,
    });
    academicAdmin.experience = experience;
  }

  if (qualification !== undefined) {
    changes.push({
      field: 'qualification',
      oldValue: academicAdmin.qualification,
      newValue: qualification,
    });
    academicAdmin.qualification = qualification;
  }

  if (permissions !== undefined) {
    changes.push({
      field: 'permissions',
      oldValue: academicAdmin.permissions,
      newValue: permissions,
    });
    academicAdmin.permissions = permissions;
  }

  await academicAdmin.save();

  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE',
    actionDescription: 'Updated academic admin profile',
    module: 'AcademicAdmin',
    entityType: 'AcademicAdmin',
    entityId: academicAdmin._id,
    changes: changes,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: academicAdmin,
  });
});

// @desc    Get department events
// @route   GET /api/academic/events
// @access  Private (Academic Admin)
const getDepartmentEvents = asyncHandler(async (req, res) => {
  const academicAdmin = await AcademicAdmin.findOne({ userId: req.user._id });
  if (!academicAdmin) {
    res.status(404);
    throw new Error('Academic admin profile not found');
  }

  const { status, category, startDate, endDate } = req.query;
  const filter = { department: academicAdmin.department };

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate);
    if (endDate) filter.startDate.$lte = new Date(endDate);
  }

  const events = await Event.find(filter)
    .populate('createdBy', 'name email')
    .populate('venue', 'name capacity')
    .populate('department', 'name code')
    .sort('-startDate');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// @desc    Get department faculty
// @route   GET /api/academic/faculty
// @access  Private (Academic Admin)
const getDepartmentFaculty = asyncHandler(async (req, res) => {
  const academicAdmin = await AcademicAdmin.findOne({ userId: req.user._id });
  if (!academicAdmin) {
    res.status(404);
    throw new Error('Academic admin profile not found');
  }

  const faculty = await User.find({
    department: academicAdmin.department,
    role: ROLES.FACULTY,
  })
    .select('-password')
    .populate('department', 'name code')
    .sort('name');

  res.status(200).json({
    success: true,
    count: faculty.length,
    data: faculty,
  });
});

// @desc    Get department students
// @route   GET /api/academic/students
// @access  Private (Academic Admin)
const getDepartmentStudents = asyncHandler(async (req, res) => {
  const academicAdmin = await AcademicAdmin.findOne({ userId: req.user._id });
  if (!academicAdmin) {
    res.status(404);
    throw new Error('Academic admin profile not found');
  }

  const { search } = req.query;
  const filter = {
    department: academicAdmin.department,
    role: ROLES.STUDENT,
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const students = await User.find(filter)
    .select('-password')
    .populate('department', 'name code')
    .sort('name');

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// @desc    Get admin permissions
// @route   GET /api/academic/permissions
// @access  Private (Academic Admin)
const getPermissions = asyncHandler(async (req, res) => {
  const academicAdmin = await AcademicAdmin.findOne({ userId: req.user._id });
  if (!academicAdmin) {
    res.status(404);
    throw new Error('Academic admin profile not found');
  }

  res.status(200).json({
    success: true,
    data: {
      adminType: academicAdmin.adminType,
      permissions: academicAdmin.permissions,
    },
  });
});

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getDepartmentEvents,
  getDepartmentFaculty,
  getDepartmentStudents,
  getPermissions,
};
