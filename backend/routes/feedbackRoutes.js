const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackForEvent,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  exportFeedback,
} = require('../controllers/feedbackController');

// Student routes - specific paths BEFORE :id
router.post('/', protect, authorize(ROLES.STUDENT), submitFeedback);
router.get('/my-feedback', protect, authorize(ROLES.STUDENT), getMyFeedback);

// Event-specific routes - BEFORE :id
router.get('/event/:eventId', protect, getFeedbackForEvent);
router.get(
  '/event/:eventId/statistics',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.FACULTY),
  getFeedbackStats
);
router.get(
  '/event/:eventId/export',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  exportFeedback
);

// Update/delete feedback - with :id
router.put('/:id', protect, authorize(ROLES.STUDENT), updateFeedback);
router.delete('/:id', protect, authorize(ROLES.STUDENT, ROLES.SUPER_ADMIN), deleteFeedback);

// Admin/Faculty routes
router.get(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getAllFeedback
);

module.exports = router;
