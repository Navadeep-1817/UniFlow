const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    permissions: {
      canManageUniversities: { type: Boolean, default: true },
      canApproveAdmins: { type: Boolean, default: true },
      canViewAllAnalytics: { type: Boolean, default: true },
      canManageUsers: { type: Boolean, default: true },
      canAccessAuditLogs: { type: Boolean, default: true },
    },
    managedUniversities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
      },
    ],
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

superAdminSchema.index({ userId: 1 });

module.exports = mongoose.model('SuperAdmin', superAdminSchema);