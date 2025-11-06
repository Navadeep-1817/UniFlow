const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    section: {
      type: String,
      uppercase: true,
      maxlength: 1,
    },
    batch: {
      type: String,
      required: true,
    },
    studentBodies: [
      {
        bodyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StudentBody',
        },
        role: {
          type: String,
          default: 'Member',
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    placementProfile: {
      isPlacementReady: {
        type: Boolean,
        default: false,
      },
      cgpa: {
        type: Number,
        min: 0,
        max: 10,
      },
      backlogs: {
        type: Number,
        min: 0,
        default: 0,
      },
      skills: [String],
      resume: {
        url: String,
        uploadedAt: Date,
      },
      isPlaced: {
        type: Boolean,
        default: false,
      },
      placedCompany: String,
      package: Number,
      placementDate: Date,
    },
    interests: [String],
    totalEventsAttended: {
      type: Number,
      default: 0,
    },
    certificatesEarned: {
      type: Number,
      default: 0,
    },
    admissionDate: {
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

studentSchema.index({ userId: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ department: 1, year: 1 });

module.exports = mongoose.model('Student', studentSchema);