const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  createStudentBody,
  getAllStudentBodies,
  getStudentBodyById,
  updateStudentBody,
  deleteStudentBody,
  getStudentBodyMembers,
  addMember,
  removeMember,
  getStudentBodyEvents
} = require('../controllers/studentBodyController');

// All routes require authentication
router.get(
  '/',
  protect,
  getAllStudentBodies
);

router.get(
  '/:id',
  protect,
  getStudentBodyById
);

router.get(
  '/:id/members',
  protect,
  getStudentBodyMembers
);

router.get(
  '/:id/events',
  protect,
  getStudentBodyEvents
);

router.post(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  createStudentBody
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  updateStudentBody
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN),
  deleteStudentBody
);

// Members management
router.post(
  '/:id/add-member',
  protect,
  authorize(ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  addMember
);

router.delete(
  '/:id/remove-member/:studentId',
  protect,
  authorize(ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  removeMember
);

module.exports = router;
