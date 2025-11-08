const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
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
  joinStudentBody,
  browseEvents
} = require('../controllers/studentController');

// Student dashboard and profile (for students themselves)
router.get('/dashboard', protect, authorize(ROLES.STUDENT), getDashboard);
router.get('/profile', protect, authorize(ROLES.STUDENT), getMyProfile);
router.get('/browse-events', protect, authorize(ROLES.STUDENT), browseEvents);

// Admin/HOD/TP/Faculty routes for managing students
router.get(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  getAllStudents
);

router.get(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY, ROLES.STUDENT),
  getStudentById
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.STUDENT),
  updateStudent
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD),
  deleteStudent
);

router.get(
  '/:id/events',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY, ROLES.STUDENT),
  getStudentEvents
);

router.get(
  '/:id/attendance',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY, ROLES.STUDENT),
  getAttendanceReport
);

router.get(
  '/:id/certificates',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.STUDENT),
  getCertificates
);

router.get(
  '/:id/student-bodies',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.STUDENT),
  getStudentBodies
);

router.post(
  '/:id/join-body',
  protect,
  authorize(ROLES.STUDENT),
  joinStudentBody
);

module.exports = router;
