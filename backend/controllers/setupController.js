const University = require('../models/University');
const User = require('../models/User');
const Student = require('../models/Student');

// @desc    Create initial university and admin for testing
// @route   POST /api/setup/init
// @access  Public (should be protected in production)
exports.initializeSystem = async (req, res) => {
  try {
    // Check if university already exists
    const existingUniversity = await University.findOne({ code: 'TEST_UNI' });
    
    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        message: 'System already initialized. University already exists.',
        data: {
          university: existingUniversity,
        },
      });
    }

    // Create default university
    const university = await University.create({
      name: 'Test University',
      code: 'TEST_UNI',
      address: {
        street: '123 University Ave',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '123456',
      },
      contactEmail: 'admin@testuniversity.edu',
      contactPhone: '1234567890',
      website: 'https://testuniversity.edu',
      logo: 'https://via.placeholder.com/200',
      establishedYear: 2020,
      accreditation: 'Test Accreditation',
      type: 'Private',
    });

    // Create super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@uniflow.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'superadmin',
      isApproved: true,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'System initialized successfully! Use these IDs for registration.',
      data: {
        university: {
          id: university._id,
          name: university.name,
          code: university.code,
        },
        superAdmin: {
          id: superAdmin._id,
          email: superAdmin.email,
          note: 'Default password: admin123',
        },
        nextSteps: [
          '1. Use this university ID in registration',
          '2. Create departments using /api/setup/department',
          '3. Register users with proper IDs',
        ],
      },
    });
  } catch (error) {
    console.error('Initialize system error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing system',
      error: error.message,
    });
  }
};

// @desc    Create a department
// @route   POST /api/setup/department
// @access  Public (should be protected in production)
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, universityId } = req.body;

    if (!name || !code || !universityId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, code, and universityId',
      });
    }

    // Verify university exists
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    // Check if department already exists
    const Department = require('../models/Department');
    const existingDept = await Department.findOne({ code, university: universityId });
    
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'Department with this code already exists',
        data: { department: existingDept },
      });
    }

    const department = await Department.create({
      name,
      code,
      university: universityId,
      description: req.body.description || `${name} Department`,
      established: req.body.established || new Date().getFullYear(),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: {
        department: {
          id: department._id,
          name: department.name,
          code: department.code,
          university: university.name,
        },
      },
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating department',
      error: error.message,
    });
  }
};

// @desc    Get all universities
// @route   GET /api/setup/universities
// @access  Public
exports.getUniversities = async (req, res) => {
  try {
    const universities = await University.find().select('_id name code contactEmail');
    
    res.status(200).json({
      success: true,
      count: universities.length,
      data: { universities },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching universities',
      error: error.message,
    });
  }
};

// @desc    Get all departments
// @route   GET /api/setup/departments
// @access  Public
exports.getDepartments = async (req, res) => {
  try {
    const Department = require('../models/Department');
    const { universityId } = req.query;
    
    // Build query - if universityId is provided, filter by it
    const query = universityId ? { university: universityId } : {};
    
    const departments = await Department.find(query)
      .populate('university', 'name code')
      .select('_id name code university');
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: { departments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message,
    });
  }
};

// @desc    Get all student bodies
// @route   GET /api/setup/student-bodies
// @access  Public
exports.getStudentBodies = async (req, res) => {
  try {
    const StudentBody = require('../models/StudentBody');
    const { universityId } = req.query;
    
    console.log('📚 Fetching student bodies for university:', universityId);
    
    // Build query - if universityId is provided, filter by it
    const query = universityId ? { university: universityId, isActive: true } : { isActive: true };
    
    console.log('Query:', JSON.stringify(query, null, 2));
    
    const studentBodies = await StudentBody.find(query)
      .populate('university', 'name code')
      .select('_id name code type description logo')
      .sort('name');
    
    console.log(`Found ${studentBodies.length} student bodies`);
    console.log('Student bodies data:', JSON.stringify(studentBodies, null, 2));
    
    res.status(200).json({
      success: true,
      count: studentBodies.length,
      data: { studentBodies },
    });
  } catch (error) {
    console.error('❌ Error fetching student bodies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student bodies',
      error: error.message,
    });
  }
};

// @desc    Quick register for testing (no university/dept validation)
// @route   POST /api/setup/quick-register
// @access  Public (Development only)
exports.quickRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and phone',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Get default university
    const university = await University.findOne();
    if (!university) {
      return res.status(400).json({
        success: false,
        message: 'No university found. Please run /api/setup/init first',
      });
    }

    // Create user as student
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'student',
      university: university._id,
      isApproved: true,
      isActive: true,
    });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      rollNumber: `STU${Date.now()}`,
      year: new Date().getFullYear().toString(),
      batch: `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
    });

    // Generate token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({
      success: true,
      message: 'Quick registration successful!',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        student: {
          id: student._id,
          rollNumber: student.rollNumber,
        },
      },
    });
  } catch (error) {
    console.error('Quick register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in quick registration',
      error: error.message,
    });
  }
};
