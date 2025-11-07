// ============================================
// NON-ACADEMIC ADMIN CONTROLLER - FIXED & STABLE
// ============================================

const NonAcademicAdmin = require('../models/NonAcademicAdmin');
const User = require('../models/User');
const StudentBody = require('../models/StudentBody');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// --------------------------------------------------
// @desc    Get non-academic admin dashboard data
// @route   GET /api/non-academic/dashboard
// @access  Private (Non-Academic Admin)
// --------------------------------------------------
const getDashboard = asyncHandler(async (req, res) => {
  const nonAcademicAdmin = await NonAcademicAdmin.findOne({ userId: req.user._id })
    .populate('studentBody', 'name type description')
    .populate('university', 'name logo')
    .populate('userId', 'name email');

  if (!nonAcademicAdmin) {
    res.status(404);
    throw new Error('Non-academic admin profile not found');
  }

  // Collect statistics safely
  const [totalEvents, upcomingEvents, studentBodyMembers, pendingApprovals] = await Promise.all([
    Event.countDocuments({
      studentBody: nonAcademicAdmin.studentBody,
    }).catch(() => 0),
    Event.countDocuments({
      studentBody: nonAcademicAdmin.studentBody,
      status: 'Upcoming',
    }).catch(() => 0),
    StudentBody.findById(nonAcademicAdmin.studentBody)
      .then(sb => sb?.members?.length || 0)
      .catch(() => 0),
    Event.countDocuments({
      studentBody: nonAcademicAdmin.studentBody,
      approvalStatus: 'Pending',
    }).catch(() => 0),
  ]);

  res.status(200).json({
    success: true,
    data: {
      profile: nonAcademicAdmin,
      stats: {
        totalEvents,
        upcomingEvents,
        studentBodyMembers,
        pendingApprovals,
      },
    },
  });
});

// --------------------------------------------------
// @desc    Get non-academic admin profile
// @route   GET /api/non-academic/profile
// @access  Private (Non-Academic Admin)
// --------------------------------------------------
const getProfile = asyncHandler(async (req, res) => {
  const nonAcademicAdmin = await NonAcademicAdmin.findOne({ userId: req.user._id })
    .populate('studentBody', 'name type description')
    .populate('university', 'name logo')
    .populate('userId', 'name email phone')
    .populate('approvedBy', 'name email');

  if (!nonAcademicAdmin) {
    res.status(404);
    throw new Error('Non-academic admin profile not found');
  }

  res.status(200).json({
    success: true,
    data: nonAcademicAdmin,
  });
});

// --------------------------------------------------
// @desc    Update non-academic admin profile
// @route   PUT /api/non-academic/profile
// @access  Private (Non-Academic Admin)
// --------------------------------------------------
const updateProfile = asyncHandler(async (req, res) => {
  const { position, tenure, permissions } = req.body;

  const nonAcademicAdmin = await NonAcademicAdmin.findOne({ userId: req.user._id });

  if (!nonAcademicAdmin) {
    res.status(404);
    throw new Error('Non-academic admin profile not found');
  }

  const changes = [];

  // Track & update allowed fields
  if (position !== undefined) {
    changes.push({
      field: 'position',
      oldValue: nonAcademicAdmin.position,
      newValue: position,
    });
    nonAcademicAdmin.position = position;
  }

  if (tenure !== undefined) {
    if (tenure.startDate) {
      changes.push({
        field: 'tenure.startDate',
        oldValue: nonAcademicAdmin.tenure?.startDate,
        newValue: tenure.startDate,
      });
      nonAcademicAdmin.tenure.startDate = tenure.startDate;
    }
    if (tenure.endDate) {
      changes.push({
        field: 'tenure.endDate',
        oldValue: nonAcademicAdmin.tenure?.endDate,
        newValue: tenure.endDate,
      });
      nonAcademicAdmin.tenure.endDate = tenure.endDate;
    }
  }

  if (permissions !== undefined) {
    changes.push({
      field: 'permissions',
      oldValue: nonAcademicAdmin.permissions,
      newValue: permissions,
    });
    nonAcademicAdmin.permissions = permissions;
  }

  await nonAcademicAdmin.save();

  // Audit log entry
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE',
    actionDescription: 'Updated non-academic admin profile',
    module: 'NonAcademicAdmin',
    entityType: 'NonAcademicAdmin',
    entityId: nonAcademicAdmin._id,
    changes: changes,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: nonAcademicAdmin,
  });
});

// --------------------------------------------------
// @desc    Get student body events
// @route   GET /api/non-academic/events
// @access  Private (Non-Academic Admin)
// --------------------------------------------------
const getStudentBodyEvents = asyncHandler(async (req, res) => {
  const nonAcademicAdmin = await NonAcademicAdmin.findOne({ userId: req.user._id });

  if (!nonAcademicAdmin) {
    res.status(404);
    throw new Error('Non-academic admin profile not found');
  }

  const { status, category, startDate, endDate } = req.query;
  const filter = { studentBody: nonAcademicAdmin.studentBody };

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
    .populate('studentBody', 'name type')
    .sort('-startDate');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// --------------------------------------------------
// @desc    Get student body members
// @route   GET /api/non-academic/members
// @access  Private (Non-Academic Admin)
// --------------------------------------------------
const getStudentBodyMembers = asyncHandler(async (req, res) => {
  const nonAcademicAdmin = await NonAcademicAdmin.findOne({ userId: req.user._id });

  if (!nonAcademicAdmin) {
    res.status(404);
    throw new Error('Non-academic admin profile not found');
  }

  const studentBody = await StudentBody.findById(nonAcademicAdmin.studentBody)
    .populate('members', 'name email phone')
    .populate('teamRepresentatives', 'name email phone')
    .populate('facultyHead', 'name email phone');

  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  res.status(200).json({
    success: true,
    data: {
      studentBody: {
        _id: studentBody._id,
        name: studentBody.name,
        type: studentBody.type,
      },
      facultyHead: studentBody.facultyHead,
      teamRepresentatives: studentBody.teamRepresentatives,
      members: studentBody.members,
      totalMembers: studentBody.members?.length || 0,
    },
  });
});

// --------------------------------------------------
// @desc    Get student body details
// @route   GET /api/non-academic/student-body
// @access  Private (Non-Academic Admin)
// --------------------------------------------------
const getStudentBody = asyncHandler(async (req, res) => {
  const nonAcademicAdmin = await NonAcademicAdmin.findOne({ userId: req.user._id });

  if (!nonAcademicAdmin) {
    res.status(404);
    throw new Error('Non-academic admin profile not found');
  }

  const studentBody = await StudentBody.findById(nonAcademicAdmin.studentBody)
    .populate('facultyHead', 'name email phone')
    .populate('teamRepresentatives', 'name email phone')
    .populate('university', 'name logo');

  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  res.status(200).json({
    success: true,
    data: studentBody,
  });
});

// --------------------------------------------------
// @desc    Get admin permissions
// @route   GET /api/non-academic/permissions
// @access  Private (Non-Academic Admin)
// --------------------------------------------------
const getPermissions = asyncHandler(async (req, res) => {
  const nonAcademicAdmin = await NonAcademicAdmin.findOne({ userId: req.user._id });

  if (!nonAcademicAdmin) {
    res.status(404);
    throw new Error('Non-academic admin profile not found');
  }

  res.status(200).json({
    success: true,
    data: {
      adminType: nonAcademicAdmin.adminType,
      permissions: nonAcademicAdmin.permissions,
    },
  });
});

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getStudentBodyEvents,
  getStudentBodyMembers,
  getStudentBody,
  getPermissions,
};
