const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  submitFeedback,
  getFeedbackForEvent,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats
} = require('../controllers/feedbackController');

// Public/Student routes
router.post('/', protect, authorize(ROLES.STUDENT), submitFeedback);
router.get('/event/:eventId', protect, getFeedbackForEvent);

// Admin routes
router.get(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getAllFeedback
);

router.get(
  '/stats/:eventId',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.FACULTY),
  getFeedbackStats
);

router.put('/:id', protect, authorize(ROLES.STUDENT), updateFeedback);
router.delete('/:id', protect, authorize(ROLES.STUDENT, ROLES.SUPER_ADMIN), deleteFeedback);

module.exports = router;
