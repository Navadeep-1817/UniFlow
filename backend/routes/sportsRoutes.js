const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getSportsEvents,
  getSportsEvent,
  createSportsEvent,
  updateSportsEvent,
  deleteSportsEvent,
  registerForSportsEvent,
  cancelSportsRegistration,
  recordResult,
  getSportsEventResults,
  getSportsStats
} = require('../controllers/sportsController');

// Public routes - IMPORTANT: Specific routes BEFORE dynamic :id routes
router.get('/', getSportsEvents);
router.get('/stats', getSportsStats); // MOVED: Must be before /:id to avoid conflict
router.get('/:id', getSportsEvent);
router.get('/:id/results', getSportsEventResults);

// Protected routes
router.use(protect);

// Student routes
router.post('/:id/register', authorize(ROLES.STUDENT), registerForSportsEvent);
router.delete('/:id/register', authorize(ROLES.STUDENT), cancelSportsRegistration);

// Sports admin routes
router.post(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  createSportsEvent
);

router.put(
  '/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  updateSportsEvent
);

router.delete(
  '/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  deleteSportsEvent
);

router.post(
  '/:id/results',
  authorize(ROLES.SUPER_ADMIN, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.NON_ACADEMIC_TEAM_REP),
  recordResult
);

module.exports = router;
