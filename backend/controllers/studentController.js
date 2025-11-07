// ============================================
// STUDENT CONTROLLER - COMPLETE IMPLEMENTATION
// File: controllers/studentController.js
// ============================================

const Student = require('../models/Student');
const User = require('../models/User');
const Department = require('../models/Department');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Certificate = require('../models/Certificate');
const StudentBody = require('../models/StudentBody');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// @desc    Get all students with filters and pagination
// @route   GET /api/students
// @access  Private (Admin, HOD, TP, Faculty)
const getAllStudents = asyncHandler(async (req, res) => {
  const {
    department,
    year,
    section,
    batch,
    isActive,
    isPlaced,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};

  // Apply filters
  if (department) query.department = department;
  if (year) query.year = parseInt(year);
  if (section) query.section = section.toUpperCase();
  if (batch) query.batch = batch;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (isPlaced !== undefined) query['placementProfile.isPlaced'] = isPlaced === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [students, total] = await Promise.all([
    Student.find(query)
      .populate('userId', 'name email phone profilePicture')
      .populate('department', 'name code')
      .populate('studentBodies.bodyId', 'name type')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Student.countDocuments(query)
  ]);

  res.json({
    success: true,
    count: students.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: students
  });
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (Admin, HOD, TP, Faculty, Student themselves)
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('userId', 'name email phone profilePicture university')
    .populate('department', 'name code hod')
    .populate('studentBodies.bodyId', 'name type description');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Check authorization
  const canAccess = 
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP ||
    req.user.role === ROLES.FACULTY ||
    student.userId.toString() === req.user._id.toString();

  if (!canAccess) {
    res.status(403);
    throw new Error('Not authorized to access this student profile');
  }

  res.json({
    success: true,
    data: student
  });
});

// @desc    Get student dashboard (for student themselves)
// @route   GET /api/students/dashboard
// @access  Private (Student)
const getDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id })
    .populate('userId', 'name email profilePicture')
    .populate('department', 'name code')
    .populate('studentBodies.bodyId', 'name type');

  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  // Get statistics
  const [totalRegistrations, upcomingEvents, attendedEvents, certificates] = await Promise.all([
    Registration.countDocuments({ studentId: student._id }),
    Registration.countDocuments({ 
      studentId: student._id,
      status: 'Approved'
    }).then(async (count) => {
      const registrations = await Registration.find({ 
        studentId: student._id,
        status: 'Approved'
      }).populate('eventId');
      return registrations.filter(r => r.eventId?.status === 'Upcoming').length;
    }),
    Attendance.countDocuments({ 
      studentId: student._id,
      isPresent: true
    }),
    Certificate.countDocuments({ studentId: student._id })
  ]);

  res.json({
    success: true,
    data: {
      profile: student,
      stats: {
        totalRegistrations,
        upcomingEvents,
        attendedEvents,
        certificates,
        totalEventsAttended: student.totalEventsAttended,
        certificatesEarned: student.certificatesEarned
      }
    }
  });
});

// @desc    Get student profile (for student themselves)
// @route   GET /api/students/profile
// @access  Private (Student)
const getMyProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id })
    .populate('userId', 'name email phone profilePicture')
    .populate('department', 'name code hod')
    .populate('studentBodies.bodyId', 'name type description');

  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  res.json({
    success: true,
    data: student
  });
});

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private (Admin, HOD, TP, Student themselves for limited fields)
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Check authorization
  const isAdmin = 
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP;
  
  const isSelf = student.userId.toString() === req.user._id.toString();

  if (!isAdmin && !isSelf) {
    res.status(403);
    throw new Error('Not authorized to update this student profile');
  }

  const changes = [];
  const allowedFields = isSelf 
    ? ['interests', 'placementProfile'] // Students can only update these
    : ['year', 'section', 'batch', 'interests', 'placementProfile', 'isActive']; // Admins can update more

  // Track and update allowed fields
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      changes.push({
        field,
        oldValue: student[field],
        newValue: req.body[field]
      });
      
      if (field === 'placementProfile' && typeof req.body[field] === 'object') {
        // Merge placement profile
        student.placementProfile = {
          ...student.placementProfile,
          ...req.body[field]
        };
      } else {
        student[field] = req.body[field];
      }
    }
  });

  await student.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE',
    actionDescription: `Updated student profile for ${student.rollNumber}`,
    module: 'Student',
    entityType: 'Student',
    entityId: student._id,
    changes,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  // Populate and return
  await student.populate([
    { path: 'userId', select: 'name email' },
    { path: 'department', select: 'name code' }
  ]);

  res.json({
    success: true,
    message: 'Student profile updated successfully',
    data: student
  });
});

// @desc    Delete student (soft delete)
// @route   DELETE /api/students/:id
// @access  Private (Admin, HOD)
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Soft delete
  student.isActive = false;
  await student.save();

  // Also deactivate user account
  await User.findByIdAndUpdate(student.userId, { isActive: false });

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'DELETE',
    actionDescription: `Deactivated student ${student.rollNumber}`,
    module: 'Student',
    entityType: 'Student',
    entityId: student._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'WARNING',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'Student deactivated successfully'
  });
});

// @desc    Get student registered events
// @route   GET /api/students/:id/events
// @access  Private (Admin, HOD, TP, Faculty, Student)
const getStudentEvents = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const { status, category } = req.query;
  const query = { studentId: student._id };

  if (status) query.status = status;

  const registrations = await Registration.find(query)
    .populate({
      path: 'eventId',
      match: category ? { category } : {},
      populate: [
        { path: 'venue', select: 'name capacity' },
        { path: 'createdBy', select: 'name' }
      ]
    })
    .sort('-createdAt');

  // Filter out null eventIds (from category filter)
  const validRegistrations = registrations.filter(r => r.eventId);

  res.json({
    success: true,
    count: validRegistrations.length,
    data: validRegistrations
  });
});

// @desc    Get student attendance report
// @route   GET /api/students/:id/attendance
// @access  Private (Admin, HOD, TP, Faculty, Student)
const getAttendanceReport = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const [totalEvents, presentCount, absentCount] = await Promise.all([
    Attendance.countDocuments({ studentId: student._id }),
    Attendance.countDocuments({ studentId: student._id, isPresent: true }),
    Attendance.countDocuments({ studentId: student._id, isPresent: false })
  ]);

  const attendancePercentage = totalEvents > 0 
    ? Math.round((presentCount / totalEvents) * 100) 
    : 0;

  const attendanceRecords = await Attendance.find({ studentId: student._id })
    .populate('eventId', 'name startDate category')
    .sort('-markedAt')
    .limit(20);

  res.json({
    success: true,
    data: {
      studentId: student._id,
      rollNumber: student.rollNumber,
      stats: {
        totalEvents,
        presentCount,
        absentCount,
        attendancePercentage
      },
      recentAttendance: attendanceRecords
    }
  });
});

// @desc    Get student certificates
// @route   GET /api/students/:id/certificates
// @access  Private (Admin, HOD, TP, Student)
const getCertificates = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const certificates = await Certificate.find({ studentId: student._id })
    .populate('eventId', 'name category startDate')
    .populate('issuedBy', 'name')
    .sort('-issuedDate');

  res.json({
    success: true,
    count: certificates.length,
    data: certificates
  });
});

// @desc    Get student body memberships
// @route   GET /api/students/:id/student-bodies
// @access  Private (Admin, HOD, TP, Student)
const getStudentBodies = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('studentBodies.bodyId', 'name type description facultyHead');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json({
    success: true,
    count: student.studentBodies.length,
    data: student.studentBodies
  });
});

// @desc    Join student body
// @route   POST /api/students/:id/join-body
// @access  Private (Student themselves)
const joinStudentBody = asyncHandler(async (req, res) => {
  const { bodyId, role = 'Member' } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Check if student is updating their own profile
  if (student.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const studentBody = await StudentBody.findById(bodyId);
  if (!studentBody) {
    res.status(404);
    throw new Error('Student body not found');
  }

  // Check if already a member
  const alreadyMember = student.studentBodies.some(
    sb => sb.bodyId.toString() === bodyId
  );

  if (alreadyMember) {
    res.status(400);
    throw new Error('Already a member of this student body');
  }

  student.studentBodies.push({
    bodyId,
    role,
    joinedDate: new Date()
  });

  await student.save();

  // Also add to StudentBody members
  if (!studentBody.members.includes(student._id)) {
    studentBody.members.push(student._id);
    await studentBody.save();
  }

  res.json({
    success: true,
    message: 'Successfully joined student body',
    data: student.studentBodies
  });
});

module.exports = {
  getAllStudents,
  getStudentById,
  getDashboard,
  getMyProfile,
  updateStudent,
  deleteStudent,
  getStudentEvents,
  getAttendanceReport,
  getCertificates,
  getStudentBodies,
  joinStudentBody
};
