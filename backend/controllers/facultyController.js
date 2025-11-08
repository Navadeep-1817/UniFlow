// ============================================
// FACULTY CONTROLLER - COMPLETE IMPLEMENTATION
// File: controllers/facultyController.js
// ============================================

const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Department = require('../models/Department');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// @desc    Get all faculty with filters and pagination
// @route   GET /api/faculty
// @access  Private (Admin, HOD, TP)
const getAllFaculty = asyncHandler(async (req, res) => {
  const {
    department,
    designation,
    specialization,
    isActive,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};

  // Apply filters
  if (department) query.department = department;
  if (designation) query.designation = designation;
  if (specialization) query.specialization = new RegExp(specialization, 'i');
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [faculty, total] = await Promise.all([
    Faculty.find(query)
      .populate('userId', 'name email phone profilePicture')
      .populate('department', 'name code')
      .populate('assignedEvents', 'name startDate category')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Faculty.countDocuments(query)
  ]);

  res.json({
    success: true,
    count: faculty.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: faculty
  });
});

// @desc    Get faculty by ID
// @route   GET /api/faculty/:id
// @access  Private (Admin, HOD, TP, Faculty themselves)
const getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id)
    .populate('userId', 'name email phone profilePicture university')
    .populate('department', 'name code hod')
    .populate('assignedEvents', 'name startDate endDate category status venue');

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  // Check if user can access this faculty profile
  const canAccess = 
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP ||
    faculty.userId.toString() === req.user._id.toString();

  if (!canAccess) {
    res.status(403);
    throw new Error('Not authorized to access this faculty profile');
  }

  res.json({
    success: true,
    data: faculty
  });
});

// @desc    Get faculty dashboard (for faculty user themselves)
// @route   GET /api/faculty/dashboard
// @access  Private (Faculty)
const getDashboard = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({ userId: req.user._id })
    .populate('userId', 'name email')
    .populate('department', 'name code')
    .populate('assignedEvents', 'name startDate status');

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty profile not found');
  }

  // Get statistics
  const [totalEvents, upcomingEvents, completedEvents] = await Promise.all([
    Event.countDocuments({ _id: { $in: faculty.assignedEvents } }),
    Event.countDocuments({ 
      _id: { $in: faculty.assignedEvents }, 
      status: 'Upcoming' 
    }),
    Event.countDocuments({ 
      _id: { $in: faculty.assignedEvents }, 
      status: 'Completed' 
    })
  ]);

  res.json({
    success: true,
    data: {
      profile: faculty,
      stats: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        experienceYears: faculty.experience
      }
    }
  });
});

// @desc    Get faculty profile (for faculty themselves)
// @route   GET /api/faculty/profile
// @access  Private (Faculty)
const getMyProfile = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({ userId: req.user._id })
    .populate('userId', 'name email phone profilePicture')
    .populate('department', 'name code hod')
    .populate('assignedEvents', 'name startDate category');

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty profile not found');
  }

  res.json({
    success: true,
    data: faculty
  });
});

// @desc    Get my events (for faculty - includes assigned and department events)
// @route   GET /api/faculty/my-events
// @access  Private (Faculty)
const getMyEvents = asyncHandler(async (req, res) => {
  // First get the faculty profile by User ID
  const user = await User.findById(req.user._id).populate('department');
  
  if (!user || !user.department) {
    res.status(404);
    throw new Error('User or department not found');
  }

  const { status, category, type } = req.query;
  
  // Build query to include department events (all events created by HOD for this department)
  const query = {
    organizer: user.department._id,
    organizerModel: 'Department'
  };

  // Apply filters
  if (status && status !== 'all') query.status = status.charAt(0).toUpperCase() + status.slice(1);
  if (category && category !== 'all') query.category = category;
  if (type && type !== 'all') query.subType = type;

  const events = await Event.find(query)
    .populate('venue', 'name building capacity')
    .populate('trainer', 'name email organization')
    .populate('coordinators', 'name email phone')
    .populate('createdBy', 'name email phone')
    .sort('-createdAt');

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Update faculty profile
// @route   PUT /api/faculty/:id
// @access  Private (Admin, HOD, TP, Faculty themselves for limited fields)
const updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  // Check authorization
  const isAdmin = 
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP;
  
  const isSelf = faculty.userId.toString() === req.user._id.toString();

  if (!isAdmin && !isSelf) {
    res.status(403);
    throw new Error('Not authorized to update this faculty profile');
  }

  const changes = [];
  const allowedFields = isSelf 
    ? ['specialization', 'subjects', 'availability'] // Faculty can only update these
    : ['designation', 'specialization', 'qualification', 'experience', 'subjects', 'department', 'availability', 'isActive']; // Admins can update more

  // Track and update allowed fields
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      changes.push({
        field,
        oldValue: faculty[field],
        newValue: req.body[field]
      });
      faculty[field] = req.body[field];
    }
  });

  await faculty.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE',
    actionDescription: `Updated faculty profile for ${faculty.userId}`,
    module: 'Faculty',
    entityType: 'Faculty',
    entityId: faculty._id,
    changes,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  // Populate and return
  await faculty.populate([
    { path: 'userId', select: 'name email' },
    { path: 'department', select: 'name code' }
  ]);

  res.json({
    success: true,
    message: 'Faculty profile updated successfully',
    data: faculty
  });
});

// @desc    Delete faculty (soft delete)
// @route   DELETE /api/faculty/:id
// @access  Private (Admin, HOD)
const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  // Soft delete
  faculty.isActive = false;
  await faculty.save();

  // Also deactivate user account
  await User.findByIdAndUpdate(faculty.userId, { isActive: false });

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'DELETE',
    actionDescription: `Deactivated faculty ${faculty.employeeId}`,
    module: 'Faculty',
    entityType: 'Faculty',
    entityId: faculty._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'WARNING',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'Faculty deactivated successfully'
  });
});

// @desc    Get faculty events (includes both assigned events and department events)
// @route   GET /api/faculty/:id/events
// @access  Private (Admin, HOD, TP, Faculty)
const getFacultyEvents = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  const { status, category, startDate, endDate } = req.query;
  
  // Build query to include both assigned events AND department events
  const query = {
    $or: [
      { _id: { $in: faculty.assignedEvents } }, // Explicitly assigned events
      { 
        organizer: faculty.department,
        organizerModel: 'Department'
      } // Department events
    ]
  };

  if (status) query.status = status;
  if (category) query.category = category;
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }

  const events = await Event.find(query)
    .populate('venue', 'name capacity')
    .populate('createdBy', 'name')
    .sort('-startDate');

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get faculty departments (can be assigned to multiple)
// @route   GET /api/faculty/:id/departments
// @access  Private (Admin, HOD, TP, Faculty)
const getFacultyDepartments = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id)
    .populate('department', 'name code hod totalFaculty totalStudents');

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  res.json({
    success: true,
    data: {
      primaryDepartment: faculty.department
    }
  });
});

// @desc    Assign event to faculty
// @route   POST /api/faculty/:id/assign-event
// @access  Private (Admin, HOD, TP)
const assignEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if already assigned
  if (faculty.assignedEvents.includes(eventId)) {
    res.status(400);
    throw new Error('Event already assigned to this faculty');
  }

  faculty.assignedEvents.push(eventId);
  await faculty.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'ASSIGN',
    actionDescription: `Assigned event ${event.name} to faculty ${faculty.employeeId}`,
    module: 'Faculty',
    entityType: 'Faculty',
    entityId: faculty._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'Event assigned to faculty successfully',
    data: faculty
  });
});

// @desc    Get faculty workload
// @route   GET /api/faculty/:id/workload
// @access  Private (Admin, HOD, TP, Faculty)
const getWorkload = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    res.status(404);
    throw new Error('Faculty not found');
  }

  const [totalEvents, upcomingEvents, ongoingEvents, completedEvents] = await Promise.all([
    Event.countDocuments({ _id: { $in: faculty.assignedEvents } }),
    Event.countDocuments({ 
      _id: { $in: faculty.assignedEvents }, 
      status: 'Upcoming' 
    }),
    Event.countDocuments({ 
      _id: { $in: faculty.assignedEvents }, 
      status: 'Ongoing' 
    }),
    Event.countDocuments({ 
      _id: { $in: faculty.assignedEvents }, 
      status: 'Completed' 
    })
  ]);

  // Calculate workload percentage (simple formula: events/10 * 100, max 100%)
  const workloadPercentage = Math.min((upcomingEvents + ongoingEvents) * 10, 100);

  res.json({
    success: true,
    data: {
      facultyId: faculty._id,
      employeeId: faculty.employeeId,
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      workloadPercentage,
      workloadStatus: workloadPercentage < 50 ? 'Low' : workloadPercentage < 75 ? 'Medium' : 'High'
    }
  });
});

module.exports = {
  getAllFaculty,
  getFacultyById,
  getDashboard,
  getMyProfile,
  getMyEvents,
  updateFaculty,
  deleteFaculty,
  getFacultyEvents,
  getFacultyDepartments,
  assignEvent,
  getWorkload
};
