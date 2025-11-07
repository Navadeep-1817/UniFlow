const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
    },
    userRole: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    action: {
      type: String,
      required: true,
      enum: ['LOGIN', 'LOGOUT', 'REGISTER', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'OTHER'],
    },
    actionDescription: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    entityName: {
      type: String,
    },
    changes: [{
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
    }],
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    severity: {
      type: String,
      enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
      default: 'INFO',
    },
    isSuccessful: {
      type: Boolean,
      default: true,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to easily log actions
auditLogSchema.statics.log = async function(logData) {
  try {
    return await this.create(logData);
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error to prevent breaking the main flow
    return null;
  }
};

// Index for better query performance
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ module: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);