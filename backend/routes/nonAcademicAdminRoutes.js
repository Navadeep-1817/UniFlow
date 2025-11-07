const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getDashboard,
  getProfile,
  updateProfile,
  getStudentBodyEvents,
  getStudentBodyMembers,
  getStudentBody,
  getPermissions
} = require('../controllers/nonAcademicAdminController');

// All routes require authentication and non-academic admin role
router.use(protect);
router.use(authorize(ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP));

// Dashboard and profile routes
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/permissions', getPermissions);

// Student body management routes
router.get('/events', getStudentBodyEvents);
router.get('/members', getStudentBodyMembers);
router.get('/student-body', getStudentBody);

module.exports = router;
