const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getStudentBodies,
  getStudentBody,
  createStudentBody,
  updateStudentBody,
  deleteStudentBody,
  addTeamRepresentative,
  removeTeamRepresentative,
  addMember,
  removeMember,
  getStudentBodyEvents
} = require('../controllers/studentBodyController');

// Public routes
router.get('/', getStudentBodies);
router.get('/:id', getStudentBody);
router.get('/:id/events', getStudentBodyEvents);

// Protected routes
router.post(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  createStudentBody
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  updateStudentBody
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN),
  deleteStudentBody
);

// Team representatives management
router.post(
  '/:id/representatives',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  addTeamRepresentative
);

router.delete(
  '/:id/representatives/:userId',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  removeTeamRepresentative
);

// Members management
router.post(
  '/:id/members',
  protect,
  authorize(ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  addMember
);

router.delete(
  '/:id/members/:userId',
  protect,
  authorize(ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  removeMember
);

module.exports = router;
