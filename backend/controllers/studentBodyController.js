// ============================================
// STUDENT BODY CONTROLLER - COMPLETE IMPLEMENTATION
// File: controllers/studentBodyController.js
// ============================================

const StudentBody = require('../models/StudentBody');
const University = require('../models/University');
const Student = require('../models/Student');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// @desc    Create new student body (club/society)
// @route   POST /api/student-bodies
// @access  Private (SuperAdmin, HOD, TP, Faculty Head)
const createStudentBody = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    type,
    university,
    description,
    facultyHead,
    teamRepresentatives,
    objectives,
    contactEmail
  } = req.body;

  // Check if student body with same code or name exists
  const existingBody = await StudentBody.findOne({
    university,
    $or: [{ code }, { name }]
  });

  if (existingBody) {
    res.status(400);
    throw new Error('Student body with this code or name already exists');
  }

  // Verify university exists
  const universityExists = await University.findById(university);
  if (!universityExists) {
    res.status(404);
    throw new Error('University not found');
  }

  const studentBody = await StudentBody.create({
    name,
    code: code.toUpperCase(),
    type,
    university,
    description,
    facultyHead,
    teamRepresentatives,
    objectives,
    contactEmail,
    createdBy: req.user._id
  });

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'CREATE',
    actionDescription: `Created student body ${name} (${code})`,
    module: 'StudentBody',
    entityType: 'StudentBody',
    entityId: studentBody._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  await studentBody.populate([
    { path: 'university', select: 'name logo' },
    { path: 'facultyHead', select: 'name email' },
    { path: 'teamRepresentatives', select: 'name email' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Student body created successfully',
    data: studentBody
  });
});

// @desc    Get all student bodies with filters
// @route   GET /api/student-bodies
// @access  Private (All authenticated users)
const getAllStudentBodies = asyncHandler(async (req, res) => {
  const {
    university,
    type,
    isActive,
    search,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query;

  const query = {};

  // Apply filters
  if (university) query.university = university;
  if (type) query.type = type;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { code: new RegExp(search, 'i') }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [studentBodies, total] = await Promise.all([
    StudentBody.find(query)
      .populate('university', 'name logo')
      .populate('facultyHead', 'name email')
      .populate('teamRepresentatives', 'name email')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    StudentBody.countDocuments(query)
  ]);

  // Get member counts
  const bodiesWithCounts = studentBodies.map(body => ({
    ...body,
    memberCount: body.members?.length || 0
  }));

  res.json({
    success: true,
    count: bodiesWithCounts.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: bodiesWithCounts
  });
});

// @desc    Get student body by ID
// @route   GET /api/student-bodies/:id
// @access  Private (All authenticated users)
const getStudentBodyById = asyncHandler(async (req, res) => {
  const studentBody = await StudentBody.findById(req.params.id)
    .populate('university', 'name logo contact')
    .populate('facultyHead', 'name email phone profilePicture')
    .populate('teamRepresentatives', 'name email phone profilePicture')
    .populate('members', 'name email phone profilePicture')
    .populate('createdBy', 'name email');

  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  // Get statistics
  const [totalEvents, upcomingEvents, completedEvents] = await Promise.all([
    Event.countDocuments({ studentBody: studentBody._id }),
    Event.countDocuments({ studentBody: studentBody._id, status: 'Upcoming' }),
    Event.countDocuments({ studentBody: studentBody._id, status: 'Completed' })
  ]);

  res.json({
    success: true,
    data: {
      ...studentBody.toObject(),
      stats: {
        totalMembers: studentBody.members?.length || 0,
        totalEvents,
        upcomingEvents,
        completedEvents
      }
    }
  });
});

// @desc    Update student body
// @route   PUT /api/student-bodies/:id
// @access  Private (SuperAdmin, HOD, TP, Faculty Head)
const updateStudentBody = asyncHandler(async (req, res) => {
  const studentBody = await StudentBody.findById(req.params.id);

  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  const changes = [];
  const allowedFields = [
    'name',
    'code',
    'type',
    'description',
    'facultyHead',
    'teamRepresentatives',
    'objectives',
    'contactEmail',
    'socialMedia',
    'achievements',
    'isActive'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      changes.push({
        field,
        oldValue: studentBody[field],
        newValue: req.body[field]
      });
      studentBody[field] = req.body[field];
    }
  });

  await studentBody.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE',
    actionDescription: `Updated student body ${studentBody.name}`,
    module: 'StudentBody',
    entityType: 'StudentBody',
    entityId: studentBody._id,
    changes,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  await studentBody.populate([
    { path: 'university', select: 'name' },
    { path: 'facultyHead', select: 'name email' },
    { path: 'teamRepresentatives', select: 'name email' }
  ]);

  res.json({
    success: true,
    message: 'Student body updated successfully',
    data: studentBody
  });
});

// @desc    Delete student body (soft delete)
// @route   DELETE /api/student-bodies/:id
// @access  Private (SuperAdmin)
const deleteStudentBody = asyncHandler(async (req, res) => {
  const studentBody = await StudentBody.findById(req.params.id);

  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  // Check if student body has upcoming events
  const upcomingEventCount = await Event.countDocuments({
    studentBody: studentBody._id,
    status: { $in: ['Upcoming', 'Ongoing'] }
  });

  if (upcomingEventCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete student body with ${upcomingEventCount} upcoming/ongoing events. Please complete or cancel them first.`
    );
  }

  // Soft delete
  studentBody.isActive = false;
  await studentBody.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'DELETE',
    actionDescription: `Deactivated student body ${studentBody.name}`,
    module: 'StudentBody',
    entityType: 'StudentBody',
    entityId: studentBody._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'WARNING',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'Student body deactivated successfully'
  });
});

// @desc    Get student body members
// @route   GET /api/student-bodies/:id/members
// @access  Private (All authenticated users)
const getStudentBodyMembers = asyncHandler(async (req, res) => {
  const studentBody = await StudentBody.findById(req.params.id)
    .populate('members', 'name email phone profilePicture department year');

  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  res.json({
    success: true,
    count: studentBody.members?.length || 0,
    data: studentBody.members || []
  });
});

// @desc    Add member to student body
// @route   POST /api/student-bodies/:id/add-member
// @access  Private (Faculty Head, Team Rep)
const addMember = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const studentBody = await StudentBody.findById(req.params.id);
  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Check if already a member
  if (studentBody.members.includes(studentId)) {
    res.status(400);
    throw new Error('Student is already a member');
  }

  studentBody.members.push(studentId);
  await studentBody.save();

  // Also update student's studentBodies array
  if (!student.studentBodies.some(sb => sb.bodyId.toString() === studentBody._id.toString())) {
    student.studentBodies.push({
      bodyId: studentBody._id,
      role: 'Member',
      joinedDate: new Date()
    });
    await student.save();
  }

  res.json({
    success: true,
    message: 'Member added successfully',
    data: studentBody
  });
});

// @desc    Remove member from student body
// @route   DELETE /api/student-bodies/:id/remove-member/:studentId
// @access  Private (Faculty Head, Team Rep)
const removeMember = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const studentBody = await StudentBody.findById(req.params.id);
  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  // Remove from members array
  studentBody.members = studentBody.members.filter(
    m => m.toString() !== studentId
  );
  await studentBody.save();

  // Also update student's studentBodies array
  const student = await Student.findById(studentId);
  if (student) {
    student.studentBodies = student.studentBodies.filter(
      sb => sb.bodyId.toString() !== studentBody._id.toString()
    );
    await student.save();
  }

  res.json({
    success: true,
    message: 'Member removed successfully'
  });
});

// @desc    Get student body events
// @route   GET /api/student-bodies/:id/events
// @access  Private (All authenticated users)
const getStudentBodyEvents = asyncHandler(async (req, res) => {
  const studentBody = await StudentBody.findById(req.params.id);

  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  const { status, category } = req.query;
  const query = { studentBody: studentBody._id };

  if (status) query.status = status;
  if (category) query.category = category;

  const events = await Event.find(query)
    .populate('createdBy', 'name')
    .populate('venue', 'name capacity')
    .sort('-startDate');

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

module.exports = {
  createStudentBody,
  getAllStudentBodies,
  getStudentBodyById,
  updateStudentBody,
  deleteStudentBody,
  getStudentBodyMembers,
  addMember,
  removeMember,
  getStudentBodyEvents
};
