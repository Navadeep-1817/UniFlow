const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  sendNotification,
  sendBulkNotification,
  broadcastNotification,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  scheduleNotification,
} = require('../controllers/notificationController');

// All notification routes require authentication
router.use(protect);

// User routes - specific paths BEFORE :id
router.get('/my-notifications', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/mark-all-read', markAllAsRead);
router.delete('/clear-read', clearReadNotifications);

// Dynamic :id routes
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin routes - send notifications
router.post(
  '/send',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  sendNotification
);

router.post(
  '/bulk',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  sendBulkNotification
);

router.post(
  '/broadcast',
  authorize(ROLES.SUPER_ADMIN),
  broadcastNotification
);

router.post(
  '/schedule',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  scheduleNotification
);

module.exports = router;
