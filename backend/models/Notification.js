const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: [
        'Event',
        'Registration',
        'Attendance',
        'Feedback',
        'Approval',
        'Announcement',
        'Reminder',
        'Certificate',
        'Placement',
        'System',
        'Other',
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    category: {
      type: String,
      enum: ['Info', 'Success', 'Warning', 'Error'],
      default: 'Info',
    },
    relatedTo: {
      model: {
        type: String,
        enum: [
          'Event',
          'Registration',
          'Attendance',
          'Feedback',
          'PlacementDrive',
          'Certificate',
          'User',
        ],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedTo.model',
      },
    },
    actionUrl: {
      type: String,
    },
    actionText: {
      type: String,
      maxlength: 50,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: Date,
    smsSent: {
      type: Boolean,
      default: false,
    },
    smsSentAt: Date,
    expiresAt: {
      type: Date,
    },
    metadata: {
      type: Map,
      of: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);