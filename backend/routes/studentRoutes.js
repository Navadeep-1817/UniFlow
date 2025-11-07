const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

// Student routes will be added here
// These routes handle student-specific operations like viewing enrolled events,
// checking grades, viewing timetable, etc.

// Example routes (to be implemented):
// router.get('/dashboard', protect, authorize(ROLES.STUDENT), getDashboard);
// router.get('/enrolled-events', protect, authorize(ROLES.STUDENT), getEnrolledEvents);
// router.get('/timetable', protect, authorize(ROLES.STUDENT), getMyTimetable);

module.exports = router;
