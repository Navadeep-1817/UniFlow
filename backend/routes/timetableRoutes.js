const express = require('express');
const {
  createTimetable,
  getAllTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  addEventToTimetable,
  removeEventFromTimetable,
  detectConflicts,
  resolveConflict,
  publishTimetable,
  archiveTimetable,
  checkVenueAvailability,
  checkFacultyAvailability
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Availability check routes (before :id routes)
router.get('/check-venue', protect, checkVenueAvailability);
router.get('/check-faculty', protect, checkFacultyAvailability);

// General routes
router.get('/', protect, getAllTimetables);
router.get('/:id', protect, getTimetableById);

// Admin routes - CRUD
router.post('/', protect, authorize('Super Admin', 'Academic Admin'), createTimetable);
router.put('/:id', protect, authorize('Super Admin', 'Academic Admin'), updateTimetable);
router.delete('/:id', protect, authorize('Super Admin', 'Academic Admin'), deleteTimetable);

// Admin routes - Manage events
router.post('/:id/events', protect, authorize('Super Admin', 'Academic Admin'), addEventToTimetable);
router.delete('/:id/events/:slotId', protect, authorize('Super Admin', 'Academic Admin'), removeEventFromTimetable);

// Admin routes - Conflict management
router.get('/:id/conflicts', protect, authorize('Super Admin', 'Academic Admin'), detectConflicts);
router.put('/:id/conflicts/:conflictId', protect, authorize('Super Admin', 'Academic Admin'), resolveConflict);

// Admin routes - Status management
router.put('/:id/publish', protect, authorize('Super Admin', 'Academic Admin'), publishTimetable);
router.put('/:id/archive', protect, authorize('Super Admin', 'Academic Admin'), archiveTimetable);

module.exports = router;
