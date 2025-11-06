const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
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
    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },
    certificateType: {
      type: String,
      enum: [
        'Participation',
        'Achievement',
        'Completion',
        'Winner',
        'Runner Up',
        'Merit',
        'Appreciation',
      ],
      default: 'Participation',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'Pass', 'Excellent', 'Good'],
    },
    score: {
      obtained: Number,
      total: Number,
      percentage: Number,
    },
    attendancePercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    achievements: [String],
    skills: [String],
    certificateUrl: {
      type: String,
    },
    templateId: {
      type: String,
    },
    qrCode: {
      type: String,
    },
    verificationCode: {
      type: String,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    signatories: [
      {
        name: String,
        designation: String,
        signature: String,
      },
    ],
    downloads: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: Date,
    isRevoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: Date,
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    revocationReason: String,
    metadata: {
      type: Map,
      of: String,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique certificate number
certificateSchema.pre('save', async function (next) {
  if (!this.certificateNumber) {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    this.certificateNumber = `CERT-${year}-${timestamp}-${random}`;
  }

  if (!this.verificationCode) {
    this.verificationCode = `VER-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
  }

  // Calculate score percentage if score exists
  if (this.score && this.score.obtained && this.score.total) {
    this.score.percentage = (
      (this.score.obtained / this.score.total) *
      100
    ).toFixed(2);
  }

  next();
});

// Indexes
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ eventId: 1, studentId: 1 });
certificateSchema.index({ isRevoked: 1 });
certificateSchema.index({ issuedDate: -1 });

// Methods
certificateSchema.methods.incrementDownloads = function () {
  this.downloads += 1;
  this.lastDownloadedAt = new Date();
  return this.save();
};

certificateSchema.methods.revoke = function (userId, reason) {
  this.isRevoked = true;
  this.revokedAt = new Date();
  this.revokedBy = userId;
  this.revocationReason = reason;
  return this.save();
};

certificateSchema.methods.verify = async function () {
  return {
    isValid: !this.isRevoked && this.isVerified,
    certificateNumber: this.certificateNumber,
    studentId: this.studentId,
    eventId: this.eventId,
    issuedDate: this.issuedDate,
    validUntil: this.validUntil,
  };
};

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;