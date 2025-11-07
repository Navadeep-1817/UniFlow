const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  cancelEvent,
  publishEvent,
  getMyEvents,
  getPendingEvents,
  getEventStats,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

// Public routes - IMPORTANT: Specific routes BEFORE dynamic :id routes
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents); // MOVED: Must be before /:id to avoid conflict
router.get('/:id', getEvent);

// Protected routes - must be authenticated
router.use(protect);

// My events - MOVED: Must be before /:id in protected section
router.get('/my/events', getMyEvents);

// Pending events for approval (Admin only) - MOVED: Must be before /:id
router.get(
  '/pending/approval',
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_HOD,
    ROLES.ACADEMIC_ADMIN_TP,
    ROLES.NON_ACADEMIC_FACULTY_HEAD
  ),
  getPendingEvents
);

// Event statistics - Keep with :id routes
router.get('/:id/stats', getEventStats);

// Create event (Faculty and above)
router.post(
  '/',
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_HOD,
    ROLES.ACADEMIC_ADMIN_TP,
    ROLES.NON_ACADEMIC_FACULTY_HEAD,
    ROLES.NON_ACADEMIC_TEAM_REP,
    ROLES.FACULTY
  ),
  createEvent
);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

// Approve event (Admin only)
router.put(
  '/:id/approve',
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_HOD,
    ROLES.ACADEMIC_ADMIN_TP,
    ROLES.NON_ACADEMIC_FACULTY_HEAD
  ),
  approveEvent
);

// Reject event (Admin only)
router.put(
  '/:id/reject',
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_HOD,
    ROLES.ACADEMIC_ADMIN_TP,
    ROLES.NON_ACADEMIC_FACULTY_HEAD
  ),
  rejectEvent
);

// Cancel event
router.put('/:id/cancel', cancelEvent);

// Publish event
router.put('/:id/publish', publishEvent);

module.exports = router;
