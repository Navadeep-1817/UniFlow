const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  sendBulkNotification
} = require('../controllers/notificationController');

// All notification routes require authentication
router.use(protect);

// User routes
router.get('/me', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

// Admin routes - send bulk notifications
router.post(
  '/bulk',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  sendBulkNotification
);

module.exports = router;
