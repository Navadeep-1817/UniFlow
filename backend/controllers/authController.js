const jwt = require('jsonwebtoken');//lahari
const crypto = require('crypto');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const AcademicAdmin = require('../models/AcademicAdmin');
const NonAcademicAdmin = require('../models/NonAcademicAdmin');
const SuperAdmin = require('../models/SuperAdmin');
const SportsAdmin = require('../models/SportsAdmin');
const Trainer = require('../models/Trainer');
const AuditLog = require('../models/AuditLog');
const { ROLES, hasPermission } = require('../config/roles');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper to get complete user data with role profile
const getUserWithProfile = async (userId) => {
  const user = await User.findById(userId)
    .populate('university', 'name code logo')
    .populate('department', 'name code')
    .populate('studentBody', 'name description')
    .lean();

  if (!user) return null;

  // Fetch role-specific profile data
  let roleProfile = null;
  switch (user.role) {
    case ROLES.STUDENT:
      roleProfile = await Student.findOne({ userId: user._id }).lean();
      if (roleProfile) {
        user.rollNumber = roleProfile.rollNumber;
        user.year = roleProfile.year;
        user.section = roleProfile.section;
        user.batch = roleProfile.batch;
      }
      break;
    case ROLES.FACULTY:
      roleProfile = await Faculty.findOne({ userId: user._id }).lean();
      if (roleProfile) {
        user.employeeId = roleProfile.employeeId;
        user.designation = roleProfile.designation;
        user.specialization = roleProfile.specialization;
      }
      break;
    case ROLES.ACADEMIC_ADMIN_HOD:
    case ROLES.ACADEMIC_ADMIN_TP:
      roleProfile = await AcademicAdmin.findOne({ userId: user._id }).lean();
      if (roleProfile) {
        user.employeeId = roleProfile.employeeId;
        user.adminType = roleProfile.adminType;
      }
      break;
    case ROLES.NON_ACADEMIC_FACULTY_HEAD:
    case ROLES.NON_ACADEMIC_TEAM_REP:
      roleProfile = await NonAcademicAdmin.findOne({ userId: user._id }).lean();
      if (roleProfile) {
        user.position = roleProfile.position;
      }
      break;
    case ROLES.SPORTS_ADMIN:
      roleProfile = await SportsAdmin.findOne({ userId: user._id }).lean();
      if (roleProfile) {
        user.employeeId = roleProfile.employeeId;
        user.designation = roleProfile.designation;
        user.specialization = roleProfile.specialization;
      }
      break;
    case ROLES.TRAINER:
      roleProfile = await Trainer.findOne({ userId: user._id }).lean();
      if (roleProfile) {
        user.employeeId = roleProfile.employeeId;
        user.specialization = roleProfile.specialization;
      }
      break;
  }

  return user;
};

// Create and send token response
const createSendToken = async (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // 'none' required for cross-origin cookies
  };

  res.cookie('token', token, cookieOptions);

  // Get complete user data with role profile
  const completeUser = await getUserWithProfile(user._id);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: completeUser,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log('📝 Registration request received:', {
      body: req.body,
      role: req.body.role
    });
    
    let { name, email, password, phone, role, ...roleSpecificData } = req.body;

    console.log('📋 After destructuring - roleSpecificData:', roleSpecificData);

    // Normalize fullName to name if needed
    if (!name && req.body.fullName) {
      name = req.body.fullName;
    }

    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Validate role
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      console.error('Invalid role received:', role);
      console.error('Valid roles:', validRoles);
      return res.status(400).json({
        success: false,
        message: `Invalid role specified: ${role}. Valid roles are: ${validRoles.join(', ')}`,
      });
    }

    // Prevent direct super admin registration
    if (role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Super admin registration is not allowed through this endpoint',
      });
    }

    // Create base user
    const userData = {
      name,
      email,
      password,
      phone,
      role,
    };

    // Add role-specific validations and fields
    if (role === ROLES.STUDENT) {
      if (!roleSpecificData.university || !roleSpecificData.department || !roleSpecificData.rollNumber || !roleSpecificData.year || !roleSpecificData.batch) {
        return res.status(400).json({
          success: false,
          message: 'University, department, roll number, year, and batch are required for students',
        });
      }
      
      // Check if roll number already exists
      const existingStudent = await Student.findOne({ rollNumber: roleSpecificData.rollNumber });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Roll number already exists',
        });
      }

      userData.university = roleSpecificData.university;
      userData.department = roleSpecificData.department;
      userData.isApproved = true; // Students are auto-approved
    }

    if (role === ROLES.FACULTY) {
      if (!roleSpecificData.university || !roleSpecificData.department || !roleSpecificData.employeeId || !roleSpecificData.designation || !roleSpecificData.qualification) {
        return res.status(400).json({
          success: false,
          message: 'University, department, employee ID, designation, and qualification are required for faculty',
        });
      }

      // Check if employee ID already exists
      const existingFaculty = await Faculty.findOne({ employeeId: roleSpecificData.employeeId });
      if (existingFaculty) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID already exists',
        });
      }

      userData.university = roleSpecificData.university;
      userData.department = roleSpecificData.department;
      userData.isApproved = false; // Requires approval
    }

    if (role === ROLES.ACADEMIC_ADMIN_HOD || role === ROLES.ACADEMIC_ADMIN_TP) {
      if (!roleSpecificData.university || !roleSpecificData.department) {
        return res.status(400).json({
          success: false,
          message: 'University and department are required for academic admins',
        });
      }
      userData.university = roleSpecificData.university;
      userData.department = roleSpecificData.department;
      userData.isApproved = false; // Requires approval
    }

    if (role === ROLES.NON_ACADEMIC_FACULTY_HEAD || role === ROLES.NON_ACADEMIC_TEAM_REP) {
      if (!roleSpecificData.university || !roleSpecificData.studentBody) {
        return res.status(400).json({
          success: false,
          message: 'University and student body are required for non-academic admins',
        });
      }
      userData.university = roleSpecificData.university;
      userData.studentBody = roleSpecificData.studentBody;
      userData.isApproved = false; // Requires approval
    }

    if (role === ROLES.SPORTS_ADMIN) {
      if (!roleSpecificData.university || !roleSpecificData.employeeId) {
        return res.status(400).json({
          success: false,
          message: 'University and employee ID are required for sports administrators',
        });
      }

      // Check if employee ID already exists
      const existingSportsAdmin = await SportsAdmin.findOne({ employeeId: roleSpecificData.employeeId });
      if (existingSportsAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID already exists',
        });
      }

      userData.university = roleSpecificData.university;
      userData.isApproved = false; // Requires approval
    }

    // Create user
    const user = await User.create(userData);

    // Create role-specific profile
    let roleProfile;
    try {
      switch (role) {
        case ROLES.STUDENT:
          roleProfile = await Student.create({
            userId: user._id,
            rollNumber: roleSpecificData.rollNumber,
            department: roleSpecificData.department,
            year: roleSpecificData.year,
            section: roleSpecificData.section,
            batch: roleSpecificData.batch,
            interests: roleSpecificData.interests || [],
            placementProfile: {
              isPlacementReady: false,
              cgpa: roleSpecificData.cgpa || 0,
              backlogs: roleSpecificData.backlogs || 0,
              skills: roleSpecificData.skills || [],
            },
          });
          break;

        case ROLES.FACULTY:
          roleProfile = await Faculty.create({
            userId: user._id,
            employeeId: roleSpecificData.employeeId,
            department: roleSpecificData.department,
            designation: roleSpecificData.designation,
            specialization: roleSpecificData.specialization,
            qualification: roleSpecificData.qualification,
            experience: roleSpecificData.experience || 0,
            subjects: roleSpecificData.subjects || [],
          });
          break;

        case ROLES.ACADEMIC_ADMIN_HOD:
        case ROLES.ACADEMIC_ADMIN_TP:
          roleProfile = await AcademicAdmin.create({
            userId: user._id,
            adminType: role === ROLES.ACADEMIC_ADMIN_HOD ? 'HOD' : 'TP',
            department: roleSpecificData.department,
            ...roleSpecificData,
          });
          break;

// Replace the NON_ACADEMIC_FACULTY_HEAD and NON_ACADEMIC_TEAM_REP case in the register function
// with this corrected version:

case ROLES.NON_ACADEMIC_FACULTY_HEAD:
case ROLES.NON_ACADEMIC_TEAM_REP:
  roleProfile = await NonAcademicAdmin.create({
    userId: user._id,
    studentBody: roleSpecificData.studentBody,
    university: roleSpecificData.university,
    position: role === ROLES.NON_ACADEMIC_FACULTY_HEAD ? 'Faculty Head' : 'Team Representative',
    adminType: role === ROLES.NON_ACADEMIC_FACULTY_HEAD ? 'FacultyHead' : 'TeamRep',
    tenure: {
      startDate: new Date() // automatically sets start date to current date
    },
    ...roleSpecificData,
  });
  break;

        case ROLES.SPORTS_ADMIN:
          console.log('🏃 Creating SportsAdmin profile with data:', {
            userId: user._id,
            university: roleSpecificData.university,
            employeeId: roleSpecificData.employeeId,
            designation: roleSpecificData.designation || 'Sports Administrator',
            specialization: roleSpecificData.specialization,
            experience: roleSpecificData.experience || 0,
          });
          roleProfile = await SportsAdmin.create({
            userId: user._id,
            university: roleSpecificData.university,
            employeeId: roleSpecificData.employeeId,
            designation: roleSpecificData.designation || 'Sports Administrator',
            specialization: roleSpecificData.specialization,
            experience: roleSpecificData.experience || 0,
          });
          break;
      }
    } catch (profileError) {
      // If role profile creation fails, delete the user
      console.error('❌ Profile creation failed:', profileError);
      console.error('Profile error details:', profileError.message);
      console.error('Profile error stack:', profileError.stack);
      await User.findByIdAndDelete(user._id);
      throw profileError;
    }


    // If user needs approval, send appropriate message
    if (!user.isApproved) {
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Your account is pending approval from an administrator.',
        data: {
          user: {
            id: user._id,
            name: user.name,  
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
          },
        },
      });
    }

    // Send token for auto-approved users (students)
    createSendToken(user, 201, res, 'Registration successful!');
  } catch (error) {
    console.error('Registration error:', error);

    // Log failed registration
    await AuditLog.log({
      action: 'REGISTER',
      actionDescription: `Failed registration attempt for email: ${req.body.email}`,
      module: 'User',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'ERROR',
      isSuccessful: false,
      errorMessage: error.message,
    });

    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Please select your role',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email })
      .select('+password')
      .populate('university', 'name logo')
      .populate('department', 'name code')
      .populate('studentBody', 'name description');

    if (!user) {
      await AuditLog.log({
        action: 'LOGIN',
        actionDescription: `Failed login attempt for non-existent email: ${email}`,
        module: 'User',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        severity: 'WARNING',
        isSuccessful: false,
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if role matches
    if (user.role !== role) {
      console.error('❌ Role mismatch during login:');
      console.error('  - Attempted role:', role);
      console.error('  - User\'s actual role:', user.role);
      console.error('  - User email:', user.email);
      
      await AuditLog.log({
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        userEmail: user.email,
        action: 'LOGIN',
        actionDescription: `Failed login attempt - Role mismatch: attempted ${role}, actual ${user.role}`,
        module: 'User',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        severity: 'WARNING',
        isSuccessful: false,
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      await AuditLog.log({
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        userEmail: user.email,
        action: 'LOGIN',
        actionDescription: 'Failed login attempt - Account deactivated',
        module: 'User',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        severity: 'WARNING',
        isSuccessful: false,
      });

      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.',
      });
    }

    // Check if user is approved
    if (!user.isApproved) {
      await AuditLog.log({
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        userEmail: user.email,
        action: 'LOGIN',
        actionDescription: 'Failed login attempt - Account pending approval',
        module: 'User',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        severity: 'INFO',
        isSuccessful: false,
      });

      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval from an administrator.',
      });
    }

    // Check password.
    // For SUPER_ADMIN, allow login using a special SUPER_ADMIN_KEY from env (bootstrap key)
    let isPasswordCorrect = false;
    try {
      if (user.role === ROLES.SUPER_ADMIN && process.env.SUPER_ADMIN_KEY && password === process.env.SUPER_ADMIN_KEY) {
        isPasswordCorrect = true;
      } else {
        isPasswordCorrect = await user.comparePassword(password);
      }
    } catch (pwErr) {
      console.error('Password comparison error:', pwErr);
      isPasswordCorrect = false;
    }

    if (!isPasswordCorrect) {
      await AuditLog.log({
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        userEmail: user.email,
        action: 'LOGIN',
        actionDescription: 'Failed login attempt - Incorrect password',
        module: 'User',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        severity: 'WARNING',
        isSuccessful: false,
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Log successful login
    await AuditLog.log({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email,
      action: 'LOGIN',
      actionDescription: 'Successful login',
      module: 'User',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    createSendToken(user, 200, res, 'Login successful!');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Log logout
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'LOGOUT',
      actionDescription: 'User logged out',
      module: 'User',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const completeUser = await getUserWithProfile(req.user._id);

    if (!completeUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: completeUser,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message,
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    // Log the update
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'UPDATE',
      actionDescription: 'User updated their profile details',
      module: 'User',
      entityType: 'User',
      entityId: user._id,
      entityName: user.name,
      changes: Object.keys(fieldsToUpdate).map((field) => ({
        field,
        newValue: fieldsToUpdate[field],
      })),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Update details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    // Log password change
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'UPDATE',
      actionDescription: 'User changed their password',
      module: 'User',
      entityType: 'User',
      entityId: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    createSendToken(user, 200, res, 'Password updated successfully');
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset url - points to frontend reset password page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Log forgot password request
    await AuditLog.log({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email,
      action: 'OTHER',
      actionDescription: 'Password reset requested',
      module: 'User',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    // TODO: Send email with reset URL
    // For now, just return the reset URL (in production, send via email)

    res.status(200).json({
      success: true,
      message: 'Password reset token generated. Check your email.',
      resetUrl, // Remove this in production
      resetToken, // Remove this in production
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request',
      error: error.message,
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetPasswordToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    // Log password reset
    await AuditLog.log({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email,
      action: 'UPDATE',
      actionDescription: 'Password reset completed',
      module: 'User',
      entityType: 'User',
      entityId: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    createSendToken(user, 200, res, 'Password reset successful');
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message,
    });
  }
};

// @desc    Approve user account
// @route   PUT /api/auth/approve/:userId
// @access  Private (Admin only)
exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('university', 'name')
      .populate('department', 'name')
      .populate('studentBody', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'User is already approved',
      });
    }

    user.isApproved = true;
    user.approvedBy = req.user._id;
    user.approvedAt = Date.now();
    await user.save();

    // Log user approval
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'APPROVE',
      actionDescription: `Approved user account for ${user.name} (${user.role})`,
      module: 'User',
      entityType: 'User',
      entityId: user._id,
      entityName: user.name,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving user',
      error: error.message,
    });
  }
};

// @desc    Reject user account
// @route   PUT /api/auth/reject/:userId
// @access  Private (Admin only)
exports.rejectUser = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete role-specific profile
    switch (user.role) {
      case ROLES.STUDENT:
        await Student.findOneAndDelete({ userId: user._id });
        break;
      case ROLES.FACULTY:
        await Faculty.findOneAndDelete({ userId: user._id });
        break;
      case ROLES.ACADEMIC_ADMIN_HOD:
      case ROLES.ACADEMIC_ADMIN_TP:
        await AcademicAdmin.findOneAndDelete({ userId: user._id });
        break;
      case ROLES.NON_ACADEMIC_FACULTY_HEAD:
      case ROLES.NON_ACADEMIC_TEAM_REP:
        await NonAcademicAdmin.findOneAndDelete({ userId: user._id });
        break;
      case ROLES.SPORTS_ADMIN:
        await SportsAdmin.findOneAndDelete({ userId: user._id });
        break;
      case ROLES.TRAINER:
        await Trainer.findOneAndDelete({ userId: user._id });
        break;
    }

    // Delete user
    await User.findByIdAndDelete(user._id);

    // Log user rejection
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'REJECT',
      actionDescription: `Rejected user registration for ${user.name} (${user.role}). Reason: ${reason || 'Not specified'}`,
      module: 'User',
      entityType: 'User',
      entityId: user._id,
      entityName: user.name,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'WARNING',
      isSuccessful: true,
    });

    res.status(200).json({
      success: true,
      message: 'User registration rejected and deleted',
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting user',
      error: error.message,
    });
  }
};

// @desc    Get pending approval users
// @route   GET /api/auth/pending-approvals
// @access  Private (Admin only)
exports.getPendingApprovals = async (req, res, next) => {
  try {
    const query = {
      isApproved: false,
      role: { $ne: ROLES.SUPER_ADMIN },
    };

    // If not super admin, filter by their domain
    if (req.user.role !== ROLES.SUPER_ADMIN) {
      if (req.user.department) {
        query.department = req.user.department;
      } else if (req.user.university) {
        query.university = req.user.university;
      }
    }

    const pendingUsers = await User.find(query)
      .populate('university', 'name logo')
      .populate('department', 'name code')
      .populate('studentBody', 'name description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: {
        users: pendingUsers,
      },
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending approvals',
      error: error.message,
    });
  }
};

// @desc    Deactivate user account
// @route   PUT /api/auth/deactivate/:userId
// @access  Private (Admin only)
exports.deactivateUser = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'User is already deactivated',
      });
    }

    user.isActive = false;
    await user.save();

    // Log user deactivation
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'UPDATE',
      actionDescription: `Deactivated user account for ${user.name}. Reason: ${reason || 'Not specified'}`,
      module: 'User',
      entityType: 'User',
      entityId: user._id,
      entityName: user.name,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'WARNING',
      isSuccessful: true,
    });

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating user',
      error: error.message,
    });
  }
};

// @desc    Activate user account
// @route   PUT /api/auth/activate/:userId
// @access  Private (Admin only)
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'User is already active',
      });
    }

    user.isActive = true;
    await user.save();

    // Log user activation
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'UPDATE',
      actionDescription: `Activated user account for ${user.name}`,
      module: 'User',
      entityType: 'User',
      entityId: user._id,
      entityName: user.name,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    res.status(200).json({
      success: true,
      message: 'User activated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating user',
      error: error.message,
    });
  }
};

// @desc    Update role-specific profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { role } = req.user;
    let updatedProfile;

    switch (role) {
      case ROLES.STUDENT:
        updatedProfile = await Student.findOneAndUpdate(
          { userId: req.user._id },
          { $set: req.body },
          { new: true, runValidators: true }
        ).populate('department', 'name code');
        break;

      case ROLES.FACULTY:
        updatedProfile = await Faculty.findOneAndUpdate(
          { userId: req.user._id },
          { $set: req.body },
          { new: true, runValidators: true }
        ).populate('department', 'name code');
        break;

      case ROLES.ACADEMIC_ADMIN_HOD:
      case ROLES.ACADEMIC_ADMIN_TP:
        updatedProfile = await AcademicAdmin.findOneAndUpdate(
          { userId: req.user._id },
          { $set: req.body },
          { new: true, runValidators: true }
        );
        break;

      case ROLES.NON_ACADEMIC_FACULTY_HEAD:
      case ROLES.NON_ACADEMIC_TEAM_REP:
        updatedProfile = await NonAcademicAdmin.findOneAndUpdate(
          { userId: req.user._id },
          { $set: req.body },
          { new: true, runValidators: true }
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role for profile update',
        });
    }

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Log profile update
    await AuditLog.log({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
      action: 'UPDATE',
      actionDescription: 'User updated their role-specific profile',
      module: 'User',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      severity: 'INFO',
      isSuccessful: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};




