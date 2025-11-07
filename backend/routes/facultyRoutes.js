const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getAllFaculty,
  getFacultyById,
  getDashboard,
  getMyProfile,
  updateFaculty,
  deleteFaculty,
  getFacultyEvents,
  getFacultyDepartments,
  assignEvent,
  getWorkload
} = require('../controllers/facultyController');

// Faculty dashboard and profile (for faculty themselves)
router.get('/dashboard', protect, authorize(ROLES.FACULTY), getDashboard);
router.get('/profile', protect, authorize(ROLES.FACULTY), getMyProfile);

// Admin/HOD/TP routes for managing faculty
router.get(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  getAllFaculty
);

router.get(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  getFacultyById
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  updateFaculty
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD),
  deleteFaculty
);

router.get(
  '/:id/events',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  getFacultyEvents
);

router.get(
  '/:id/departments',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  getFacultyDepartments
);

router.post(
  '/:id/assign-event',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  assignEvent
);

router.get(
  '/:id/workload',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  getWorkload
);

module.exports = router;
