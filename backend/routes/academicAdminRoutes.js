const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

// Academic admin routes will be added here
// These routes handle academic administrative operations like managing
// departments, courses, academic events, placements, etc.

// Example routes (to be implemented):
// router.get('/dashboard', protect, authorize(ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP), getDashboard);
// router.get('/departments', protect, authorize(ROLES.ACADEMIC_ADMIN_HOD), getDepartments);

module.exports = router;
