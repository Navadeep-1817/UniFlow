// ============================================
// DEPARTMENT CONTROLLER - COMPLETE IMPLEMENTATION
// File: controllers/departmentController.js
// ============================================

const Department = require('../models/Department');
const University = require('../models/University');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (SuperAdmin, HOD, TP)
const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, university, hod, description, courses } = req.body;

  // Check if department with same code exists in the university
  const existingDept = await Department.findOne({ university, code });
  if (existingDept) {
    res.status(400);
    throw new Error('Department with this code already exists in the university');
  }

  // Verify university exists
  const universityExists = await University.findById(university);
  if (!universityExists) {
    res.status(404);
    throw new Error('University not found');
  }

  const department = await Department.create({
    name,
    code: code.toUpperCase(),
    university,
    hod,
    description,
    courses,
    createdBy: req.user._id
  });

  // Update university department count
  await University.findByIdAndUpdate(
    university,
    { $inc: { totalDepartments: 1 } }
  );

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'CREATE',
    actionDescription: `Created department ${name} (${code})`,
    module: 'Department',
    entityType: 'Department',
    entityId: department._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  await department.populate([
    { path: 'university', select: 'name logo' },
    { path: 'hod', select: 'name email' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Department created successfully',
    data: department
  });
});

// @desc    Get all departments with filters
// @route   GET /api/departments
// @access  Private (All authenticated users)
const getAllDepartments = asyncHandler(async (req, res) => {
  const {
    university,
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
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { code: new RegExp(search, 'i') }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [departments, total] = await Promise.all([
    Department.find(query)
      .populate('university', 'name logo')
      .populate('hod', 'name email')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Department.countDocuments(query)
  ]);

  // Get faculty and student counts for each department
  const departmentsWithCounts = await Promise.all(
    departments.map(async (dept) => {
      const [facultyCount, studentCount] = await Promise.all([
        Faculty.countDocuments({ department: dept._id, isActive: true }),
        Student.countDocuments({ department: dept._id, isActive: true })
      ]);

      return {
        ...dept,
        actualFacultyCount: facultyCount,
        actualStudentCount: studentCount
      };
    })
  );

  res.json({
    success: true,
    count: departmentsWithCounts.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: departmentsWithCounts
  });
});

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private (All authenticated users)
const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)
    .populate('university', 'name logo contact')
    .populate('hod', 'name email phone profilePicture')
    .populate('createdBy', 'name email');

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  // Get actual counts
  const [facultyCount, studentCount, facultyList, studentsByYear] = await Promise.all([
    Faculty.countDocuments({ department: department._id, isActive: true }),
    Student.countDocuments({ department: department._id, isActive: true }),
    Faculty.find({ department: department._id, isActive: true })
      .populate('userId', 'name email')
      .select('employeeId designation specialization')
      .limit(10),
    Student.aggregate([
      { $match: { department: department._id, isActive: true } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      ...department.toObject(),
      stats: {
        totalFaculty: facultyCount,
        totalStudents: studentCount,
        studentsByYear
      },
      recentFaculty: facultyList
    }
  });
});

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (SuperAdmin, HOD, TP)
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  const changes = [];
  const allowedFields = ['name', 'code', 'hod', 'description', 'courses', 'isActive'];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      changes.push({
        field,
        oldValue: department[field],
        newValue: req.body[field]
      });
      department[field] = req.body[field];
    }
  });

  await department.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE',
    actionDescription: `Updated department ${department.name}`,
    module: 'Department',
    entityType: 'Department',
    entityId: department._id,
    changes,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  await department.populate([
    { path: 'university', select: 'name' },
    { path: 'hod', select: 'name email' }
  ]);

  res.json({
    success: true,
    message: 'Department updated successfully',
    data: department
  });
});

// @desc    Delete department (soft delete)
// @route   DELETE /api/departments/:id
// @access  Private (SuperAdmin)
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  // Check if department has active faculty or students
  const [facultyCount, studentCount] = await Promise.all([
    Faculty.countDocuments({ department: department._id, isActive: true }),
    Student.countDocuments({ department: department._id, isActive: true })
  ]);

  if (facultyCount > 0 || studentCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete department with ${facultyCount} active faculty and ${studentCount} active students. Please transfer them first.`
    );
  }

  // Soft delete
  department.isActive = false;
  await department.save();

  // Update university department count
  await University.findByIdAndUpdate(
    department.university,
    { $inc: { totalDepartments: -1 } }
  );

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'DELETE',
    actionDescription: `Deactivated department ${department.name}`,
    module: 'Department',
    entityType: 'Department',
    entityId: department._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'WARNING',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'Department deactivated successfully'
  });
});

// @desc    Get department faculty
// @route   GET /api/departments/:id/faculty
// @access  Private (All authenticated users)
const getDepartmentFaculty = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  const { designation, isActive = true } = req.query;
  const query = { department: department._id };

  if (designation) query.designation = designation;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const faculty = await Faculty.find(query)
    .populate('userId', 'name email phone profilePicture')
    .sort('employeeId');

  res.json({
    success: true,
    count: faculty.length,
    data: faculty
  });
});

// @desc    Get department students
// @route   GET /api/departments/:id/students
// @access  Private (All authenticated users)
const getDepartmentStudents = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  const { year, section, isActive = true } = req.query;
  const query = { department: department._id };

  if (year) query.year = parseInt(year);
  if (section) query.section = section.toUpperCase();
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const students = await Student.find(query)
    .populate('userId', 'name email phone profilePicture')
    .sort('rollNumber');

  res.json({
    success: true,
    count: students.length,
    data: students
  });
});

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentFaculty,
  getDepartmentStudents
};
