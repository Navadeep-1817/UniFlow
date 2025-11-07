const express = require('express');
const router = express.Router();
const {
  getDepartmentEvents,
  createDepartmentEvent,
  updateDepartmentEvent,
  deleteDepartmentEvent,
  getEventParticipants,
  getDepartmentFaculty,
  getDepartmentStudents,
  allocateTrainerToEvent,
  getVerifiedTrainers,
  getDashboardStats
} = require('../controllers/hodController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

// All routes require authentication and HOD role
router.use(protect);
router.use(authorize(ROLES.ACADEMIC_ADMIN_HOD));

// Dashboard stats
router.get('/dashboard-stats', getDashboardStats);

// Faculty routes
router.get('/faculty', getDepartmentFaculty);

// Student routes
router.get('/students', getDepartmentStudents);

// Trainer routes
router.get('/trainers', getVerifiedTrainers);

// Event routes
router.get('/events', getDepartmentEvents);
router.post('/events', createDepartmentEvent);
router.put('/events/:id', updateDepartmentEvent);
router.delete('/events/:id', deleteDepartmentEvent);

// Event participants
router.get('/events/:id/participants', getEventParticipants);

// Trainer allocation
router.put('/events/:id/allocate-trainer', allocateTrainerToEvent);

module.exports = router;