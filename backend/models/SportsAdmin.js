const mongoose = require('mongoose');

const sportsAdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      default: 'Sports Administrator',
    },
    specialization: {
      type: String,
      maxlength: 200,
    },
    experience: {
      type: Number,
      default: 0,
    },
    certifications: [{
      name: String,
      issuedBy: String,
      issuedDate: Date,
    }],
    managedSports: [{
      type: String,
    }],
    permissions: {
      canCreateEvents: { type: Boolean, default: true },
      canApproveEvents: { type: Boolean, default: true },
      canManageVenues: { type: Boolean, default: true },
      canManageEquipment: { type: Boolean, default: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
sportsAdminSchema.index({ userId: 1 });
sportsAdminSchema.index({ university: 1 });
sportsAdminSchema.index({ employeeId: 1 });

module.exports = mongoose.model('SportsAdmin', sportsAdminSchema);
