const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getOverallAnalytics,
  getEventAnalytics,
  getDepartmentAnalytics,
  getStudentBodyAnalytics,
  getUserEngagementAnalytics,
  getAttendanceTrends,
  getRegistrationTrends,
  exportAnalyticsReport
} = require('../controllers/analyticsController');

// All analytics routes require authentication
router.use(protect);

// Admin-level analytics
router.get(
  '/overall',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getOverallAnalytics
);

router.get(
  '/events',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.FACULTY),
  getEventAnalytics
);

router.get(
  '/departments',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD),
  getDepartmentAnalytics
);

router.get(
  '/student-bodies',
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getStudentBodyAnalytics
);

router.get(
  '/user-engagement',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getUserEngagementAnalytics
);

router.get(
  '/attendance-trends',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.FACULTY),
  getAttendanceTrends
);

router.get(
  '/registration-trends',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getRegistrationTrends
);

router.get(
  '/export',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  exportAnalyticsReport
);

module.exports = router;
