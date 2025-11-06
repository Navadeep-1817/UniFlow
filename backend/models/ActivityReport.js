const mongoose = require('mongoose');

const activityReportSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    reportTitle: {
      type: String,
      required: true,
      trim: true,
    },
    reportNumber: {
      type: String,
      unique: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      enum: ['Odd', 'Even', 'Summer', 'Annual'],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    eventSummary: {
      eventName: String,
      eventType: String,
      eventDate: Date,
      duration: Number, // in hours
      venue: String,
      coordinator: String,
    },
    statistics: {
      totalRegistrations: {
        type: Number,
        default: 0,
      },
      totalAttendance: {
        type: Number,
        default: 0,
      },
      attendancePercentage: {
        type: Number,
        default: 0,
      },
      sessionsPlanned: {
        type: Number,
        default: 0,
      },
      sessionsConducted: {
        type: Number,
        default: 0,
      },
      certificatesIssued: {
        type: Number,
        default: 0,
      },
      averageFeedbackRating: {
        type: Number,
        default: 0,
      },
    },
    participantBreakdown: {
      byYear: [
        {
          year: String,
          count: Number,
        },
      ],
      byDepartment: [
        {
          department: String,
          count: Number,
        },
      ],
      byGender: {
        male: { type: Number, default: 0 },
        female: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },
    },
    trainerDetails: [
      {
        name: String,
        organization: String,
        designation: String,
        sessionsHandled: Number,
        averageRating: Number,
      },
    ],
    sessionsReport: [
      {
        sessionNumber: Number,
        date: Date,
        topic: String,
        trainer: String,
        attendanceCount: Number,
        attendancePercentage: Number,
        duration: Number,
      },
    ],
    feedbackSummary: {
      totalResponses: {
        type: Number,
        default: 0,
      },
      averageRatings: {
        contentQuality: Number,
        trainerEffectiveness: Number,
        organization: Number,
        relevance: Number,
        overall: Number,
      },
      topStrengths: [String],
      areasForImprovement: [String],
    },
    outcomes: {
      learningOutcomes: [String],
      skillsDeveloped: [String],
      certifications: [String],
      followUpActions: [String],
    },
    financialSummary: {
      budgetAllocated: Number,
      actualExpenditure: Number,
      trainerFees: Number,
      resourceCosts: Number,
      venueCosts: Number,
      miscellaneous: Number,
    },
    resources: [
      {
        type: String,
        title: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    photographs: [
      {
        url: String,
        caption: String,
        uploadedAt: Date,
      },
    ],
    challenges: [
      {
        issue: String,
        resolution: String,
      },
    ],
    recommendations: [String],
    conclusionRemarks: {
      type: String,
      maxlength: 2000,
    },
    preparedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: String,
      designation: String,
    },
    approvedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,
        designation: String,
        approvedAt: Date,
        signature: String,
      },
    ],
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Published'],
      default: 'Draft',
    },
    submittedAt: Date,
    publishedAt: Date,
    pdfUrl: String,
    excelUrl: String,
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate report number
activityReportSchema.pre('save', async function (next) {
  if (!this.reportNumber) {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.reportNumber = `AR-${year}${month}-${random}`;
  }
  next();
});

// Indexes
activityReportSchema.index({ eventId: 1 });
activityReportSchema.index({ reportNumber: 1 });
activityReportSchema.index({ academicYear: 1, semester: 1 });
activityReportSchema.index({ status: 1 });
activityReportSchema.index({ departmentId: 1 });

// Methods
activityReportSchema.methods.calculateStatistics = async function () {
  // This would be populated from Event, Registration, Attendance, and Feedback collections
  return this;
};

activityReportSchema.methods.submit = function (userId) {
  this.status = 'Submitted';
  this.submittedAt = new Date();
  return this.save();
};

activityReportSchema.methods.approve = function (userId, userName, designation, signature) {
  this.approvedBy.push({
    userId,
    name: userName,
    designation,
    approvedAt: new Date(),
    signature,
  });
  
  if (this.status === 'Under Review') {
    this.status = 'Approved';
  }
  
  return this.save();
};

activityReportSchema.methods.publish = function () {
  this.status = 'Published';
  this.publishedAt = new Date();
  return this.save();
};

const ActivityReport = mongoose.model('ActivityReport', activityReportSchema);

module.exports = ActivityReport;