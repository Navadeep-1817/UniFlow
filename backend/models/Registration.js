const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        'Registered',
        'Waitlisted',
        'Confirmed',
        'Attended',
        'Absent',
        'Cancelled',
      ],
      default: 'Registered',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    payment: {
      isRequired: {
        type: Boolean,
        default: false,
      },
      amount: Number,
      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
      },
      transactionId: String,
      paidAt: Date,
    },
    qrCode: {
      type: String,
    },
    checkIn: {
      checkedIn: {
        type: Boolean,
        default: false,
      },
      checkedInAt: Date,
      checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    attendancePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
    },
    feedbackSubmitted: {
      type: Boolean,
      default: false,
    },
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
    },
    cancelledAt: Date,
    cancellationReason: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate unique registration number
registrationSchema.pre('save', async function (next) {
  if (!this.registrationNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    this.registrationNumber = `REG-${timestamp}-${random}`;
  }
  next();
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
registrationSchema.index({ registrationNumber: 1 });
registrationSchema.index({ status: 1 });

module.exports = mongoose.model('Registration', registrationSchema);