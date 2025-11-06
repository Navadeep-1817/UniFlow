const mongoose = require('mongoose');

const academicAdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    adminType: {
      type: String,
      enum: ['HOD', 'TP'],
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    specialization: {
      type: String,
      maxlength: 100,
    },
    experience: {
      type: Number, // in years
      min: 0,
    },
    qualification: {
      type: String,
      maxlength: 200,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permissions: {
      canCreateEvents: { type: Boolean, default: true },
      canManageFaculty: { type: Boolean, default: true },
      canManageStudents: { type: Boolean, default: true },
      canApproveEvents: { type: Boolean, default: true },
      canBookVenues: { type: Boolean, default: true },
      canManageTrainers: { type: Boolean, default: true },
    },
    joinedDate: {
      type: Date,
      default: Date.now,
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

academicAdminSchema.index({ userId: 1 });
academicAdminSchema.index({ department: 1, adminType: 1 });

module.exports = mongoose.model('AcademicAdmin', academicAdminSchema);