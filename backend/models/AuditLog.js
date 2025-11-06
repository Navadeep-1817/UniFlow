const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: String,
    userRole: String,
    userEmail: String,
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE',
        'READ',
        'UPDATE',
        'DELETE',
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'APPROVE',
        'REJECT',
        'SUBMIT',
        'DOWNLOAD',
        'UPLOAD',
        'EXPORT',
        'IMPORT',
        'SEND_NOTIFICATION',
        'MARK_ATTENDANCE',
        'GENERATE_CERTIFICATE',
        'GENERATE_REPORT',
        'CANCEL',
        'RESTORE',
        'ARCHIVE',
        'UNARCHIVE',
        'PUBLISH',
        'UNPUBLISH',
        'VERIFY',
        'REVOKE',
        'ASSIGN',
        'UNASSIGN',
        'OTHER',
      ],
    },
    actionDescription: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      enum: [
        'Event',
        'Registration',
        'Attendance',
        'Certificate',
        'Feedback',
        'Report',
        'User',
        'Department',
        'Venue',
        'Trainer',
        'Resource',
        'Notification',
        'Approval',
        'Timetable',
        'Analytics',
        'System',
        'Other',
      ],
      required: true,
    },
    entityType: String,
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    entityName: String,
    previousData: {
      type: mongoose.Schema.Types.Mixed,
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
    },
    changes: [
      {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
      },
    ],
    ipAddress: String,
    userAgent: String,
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
    },
    location: {
      country: String,
      region: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    sessionId: String,
    requestMethod: String,
    requestUrl: String,
    statusCode: Number,
    responseTime: Number, // in milliseconds
    errorMessage: String,
    stackTrace: String,
    severity: {
      type: String,
      enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
      default: 'INFO',
    },
    isSuccessful: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    tags: [String],
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate log ID
auditLogSchema.pre('save', async function (next) {
  if (!this.logId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.logId = `LOG-${timestamp}-${random}`;
  }
  next();
});

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ module: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ isSuccessful: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ departmentId: 1, timestamp: -1 });
auditLogSchema.index({ logId: 1 });

// Static methods
auditLogSchema.statics.log = async function (logData) {
  try {
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error to prevent disrupting main application flow
  }
};

auditLogSchema.statics.getUserActivity = async function (userId, startDate, endDate) {
  return this.find({
    userId,
    timestamp: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ timestamp: -1 })
    .limit(100);
};

auditLogSchema.statics.getModuleActivity = async function (module, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        module,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        users: { $addToSet: '$userId' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

auditLogSchema.statics.getSecurityEvents = async function (severity, limit = 50) {
  return this.find({
    severity: { $in: ['ERROR', 'CRITICAL'] },
    isSuccessful: false,
  })
    .sort({ timestamp: -1 })
    .limit(limit);
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;