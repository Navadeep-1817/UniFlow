const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    sessionTitle: {
      type: String,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
    },
    present: {
      type: Boolean,
      required: true,
      default: false,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ['Manual', 'QR Code', 'Biometric', 'GPS'],
      default: 'Manual',
    },
    qrVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    remarks: {
      type: String,
      maxlength: 500,
    },
    lateEntry: {
      isLate: {
        type: Boolean,
        default: false,
      },
      minutesLate: Number,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate attendance
attendanceSchema.index(
  { eventId: 1, studentId: 1, sessionNumber: 1 },
  { unique: true }
);
attendanceSchema.index({ registrationId: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ present: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);