const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  checkConflicts,
  getEventConflicts,
  getVenueConflicts,
  resolveConflict,
  getConflictHistory
} = require('../controllers/conflictController');

// All conflict routes require authentication and admin access
router.use(protect);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD));

// Conflict detection routes
router.post('/check', checkConflicts);
router.get('/event/:eventId', getEventConflicts);
router.get('/venue/:venueId', getVenueConflicts);
router.get('/history', getConflictHistory);

// Conflict resolution
router.post('/:conflictId/resolve', resolveConflict);

module.exports = router;
