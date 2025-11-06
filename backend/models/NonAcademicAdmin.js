const mongoose = require('mongoose');

const nonAcademicAdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    adminType: {
      type: String,
      enum: ['FacultyHead', 'TeamRep'],
      required: true,
    },
    studentBody: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentBody',
      required: true,
    },
    position: {
      type: String,
      maxlength: 100,
    },
    tenure: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
      },
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    permissions: {
      canCreateEvents: { type: Boolean, default: true },
      canApproveEvents: {
        type: Boolean,
        default: function () {
          return this.adminType === 'FacultyHead';
        },
      },
      canManageMembers: { type: Boolean, default: true },
      canRequestBudget: { type: Boolean, default: true },
      canBookVenues: { type: Boolean, default: true },
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

nonAcademicAdminSchema.index({ userId: 1 });
nonAcademicAdminSchema.index({ studentBody: 1, adminType: 1 });

module.exports = mongoose.model('NonAcademicAdmin', nonAcademicAdminSchema);