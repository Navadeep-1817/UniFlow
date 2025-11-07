const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Send notification to a single user
 * @route   POST /api/notifications
 * @access  Private (Admins)
 */
const sendNotification = asyncHandler(async (req, res) => {
  const {
    userId,
    title,
    message,
    type,
    priority,
    category,
    relatedTo,
    actionUrl,
    actionText,
    channels,
    expiresAt,
    metadata,
  } = req.body;

  // Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Create notification
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    priority: priority || 'Medium',
    category: category || 'Info',
    relatedTo,
    actionUrl,
    actionText,
    channels: channels || { inApp: true, email: false, sms: false, push: false },
    expiresAt,
    metadata,
    createdBy: req.user._id,
  });

  // Populate notification
  const populatedNotification = await Notification.findById(notification._id)
    .populate('userId', 'name email')
    .populate('createdBy', 'name email');

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Notification Sent',
    resource: 'Notification',
    resourceId: notification._id,
    details: `Notification sent to: ${user.name} (${user.email})`,
  });

  res.status(201).json({
    success: true,
    message: 'Notification sent successfully',
    data: populatedNotification,
  });
});

/**
 * @desc    Send bulk notifications to multiple users
 * @route   POST /api/notifications/bulk
 * @access  Private (Admins)
 */
const sendBulkNotification = asyncHandler(async (req, res) => {
  const {
    userIds,
    roles,
    departments,
    title,
    message,
    type,
    priority,
    category,
    relatedTo,
    actionUrl,
    actionText,
    channels,
    expiresAt,
    metadata,
  } = req.body;

  let targetUsers = [];

  // Build user query
  const query = {};

  if (userIds && userIds.length > 0) {
    // Send to specific users
    query._id = { $in: userIds };
  } else if (roles && roles.length > 0) {
    // Send to users with specific roles
    query.role = { $in: roles };
  } else if (departments && departments.length > 0) {
    // Send to users in specific departments
    query.department = { $in: departments };
  } else {
    res.status(400);
    throw new Error('Please specify userIds, roles, or departments');
  }

  // Get target users
  targetUsers = await User.find(query).select('_id name email');

  if (targetUsers.length === 0) {
    res.status(404);
    throw new Error('No users found matching the criteria');
  }

  // Create notifications for all users
  const notifications = targetUsers.map((user) => ({
    userId: user._id,
    title,
    message,
    type,
    priority: priority || 'Medium',
    category: category || 'Info',
    relatedTo,
    actionUrl,
    actionText,
    channels: channels || { inApp: true, email: false, sms: false, push: false },
    expiresAt,
    metadata,
    createdBy: req.user._id,
  }));

  // Bulk insert notifications
  const createdNotifications = await Notification.insertMany(notifications);

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Bulk Notifications Sent',
    resource: 'Notification',
    resourceId: null,
    details: `Bulk notifications sent to ${createdNotifications.length} users`,
  });

  res.status(201).json({
    success: true,
    message: `Notifications sent to ${createdNotifications.length} users`,
    data: {
      count: createdNotifications.length,
      recipients: targetUsers.map((u) => ({ id: u._id, name: u.name, email: u.email })),
    },
  });
});

/**
 * @desc    Broadcast notification to all users
 * @route   POST /api/notifications/broadcast
 * @access  Private (Super Admin only)
 */
const broadcastNotification = asyncHandler(async (req, res) => {
  const {
    title,
    message,
    type,
    priority,
    category,
    actionUrl,
    actionText,
    channels,
    expiresAt,
    metadata,
  } = req.body;

  // Get all active users
  const allUsers = await User.find({ isActive: true }).select('_id name email');

  if (allUsers.length === 0) {
    res.status(404);
    throw new Error('No active users found');
  }

  // Create notifications for all users
  const notifications = allUsers.map((user) => ({
    userId: user._id,
    title,
    message,
    type: type || 'Announcement',
    priority: priority || 'High',
    category: category || 'Info',
    actionUrl,
    actionText,
    channels: channels || { inApp: true, email: true, sms: false, push: false },
    expiresAt,
    metadata,
    createdBy: req.user._id,
  }));

  // Bulk insert notifications
  const createdNotifications = await Notification.insertMany(notifications);

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Broadcast Notification Sent',
    resource: 'Notification',
    resourceId: null,
    details: `Broadcast notification sent to all ${createdNotifications.length} active users`,
  });

  res.status(201).json({
    success: true,
    message: `Broadcast notification sent to ${createdNotifications.length} users`,
    data: {
      count: createdNotifications.length,
    },
  });
});

/**
 * @desc    Get my notifications
 * @route   GET /api/notifications/me
 * @access  Private
 */
const getMyNotifications = asyncHandler(async (req, res) => {
  const {
    type,
    priority,
    category,
    isRead,
    page = 1,
    limit = 20,
    sortBy = '-createdAt',
  } = req.query;

  // Build query
  const query = {
    userId: req.user._id,
  };

  if (type) query.type = type;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (isRead !== undefined) query.isRead = isRead === 'true';

  // Filter out expired notifications
  query.$or = [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }];

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const notifications = await Notification.find(query)
    .populate('createdBy', 'name email')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: notifications,
  });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
  });

  res.status(200).json({
    success: true,
    data: {
      unreadCount,
    },
  });
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Check ownership
  if (notification.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this notification');
  }

  // Mark as read
  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    {
      userId: req.user._id,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} notifications marked as read`,
    data: {
      modifiedCount: result.modifiedCount,
    },
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Check ownership
  if (notification.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this notification');
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

/**
 * @desc    Delete all read notifications
 * @route   DELETE /api/notifications/clear-read
 * @access  Private
 */
const clearReadNotifications = asyncHandler(async (req, res) => {
  const result = await Notification.deleteMany({
    userId: req.user._id,
    isRead: true,
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} read notifications cleared`,
    data: {
      deletedCount: result.deletedCount,
    },
  });
});

/**
 * @desc    Schedule notification (future implementation with job queue)
 * @route   POST /api/notifications/schedule
 * @access  Private (Admins)
 */
const scheduleNotification = asyncHandler(async (req, res) => {
  const {
    userId,
    userIds,
    roles,
    departments,
    title,
    message,
    type,
    priority,
    category,
    scheduledFor,
    channels,
  } = req.body;

  if (!scheduledFor) {
    res.status(400);
    throw new Error('scheduledFor date is required');
  }

  const scheduledDate = new Date(scheduledFor);
  if (scheduledDate <= new Date()) {
    res.status(400);
    throw new Error('scheduledFor must be a future date');
  }

  // For now, create a notification with expiresAt as scheduledFor
  // In production, this would use a job queue (Bull, Agenda, etc.)
  
  // Create audit log for scheduled notification
  await AuditLog.create({
    userId: req.user._id,
    action: 'Notification Scheduled',
    resource: 'Notification',
    resourceId: null,
    details: `Notification scheduled for ${scheduledDate.toISOString()}`,
  });

  res.status(200).json({
    success: true,
    message: 'Notification scheduling feature is under development',
    data: {
      scheduledFor: scheduledDate,
      note: 'This feature requires job queue implementation (Bull/Agenda)',
    },
  });
});

module.exports = {
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
};
