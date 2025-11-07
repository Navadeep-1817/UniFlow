const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

// Non-academic admin routes will be added here
// These routes handle non-academic administrative operations like managing
// student bodies, sports events, cultural activities, etc.

// Example routes (to be implemented):
// router.get('/dashboard', protect, authorize(ROLES.NON_ACADEMIC_FACULTY_HEAD), getDashboard);
// router.get('/student-bodies', protect, authorize(ROLES.NON_ACADEMIC_FACULTY_HEAD), getStudentBodies);

module.exports = router;
