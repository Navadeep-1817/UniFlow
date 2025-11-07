const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getDashboard,
  getProfile,
  updateProfile,
  getDepartmentEvents,
  getDepartmentFaculty,
  getDepartmentStudents,
  getPermissions
} = require('../controllers/academicAdminController');

// All routes require authentication and academic admin role
router.use(protect);
router.use(authorize(ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP));

// Dashboard and profile routes
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/permissions', getPermissions);

// Department management routes
router.get('/events', getDepartmentEvents);
router.get('/faculty', getDepartmentFaculty);
router.get('/students', getDepartmentStudents);

module.exports = router;
