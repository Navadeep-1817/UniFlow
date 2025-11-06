const mongoose = require('mongoose');

const approvalRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
    },
    requestType: {
      type: String,
      enum: [
        'Event Creation',
        'Event Modification',
        'Event Cancellation',
        'Budget Approval',
        'Venue Booking',
        'Trainer Invitation',
        'Resource Allocation',
        'Certificate Issuance',
        'Report Publication',
        'Leave Request',
        'Other',
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: [
        'Event',
        'Registration',
        'Certificate',
        'Report',
        'Resource',
        'Venue',
        'Budget',
        'Other',
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'entityType',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    requestedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: String,
      email: String,
      department: String,
      designation: String,
    },
    requestDetails: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    eventDetails: {
      eventName: String,
      eventType: String,
      eventDate: Date,
      duration: Number,
      venue: String,
      expectedParticipants: Number,
      targetAudience: [String],
      department: String,
    },
    budgetDetails: {
      estimatedCost: Number,
      breakdown: [
        {
          item: String,
          amount: Number,
          description: String,
        },
      ],
      fundingSource: String,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    approvalWorkflow: [
      {
        level: Number,
        approverRole: String,
        approverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        approverName: String,
        status: {
          type: String,
          enum: ['Pending', 'Approved', 'Rejected', 'Forwarded'],
          default: 'Pending',
        },
        comments: String,
        actionDate: Date,
        signature: String,
      },
    ],
    currentApprovalLevel: {
      type: Number,
      default: 1,
    },
    overallStatus: {
      type: String,
      enum: [
        'Pending',
        'Under Review',
        'Approved',
        'Rejected',
        'Cancelled',
        'On Hold',
      ],
      default: 'Pending',
    },
    rejectionReason: String,
    cancellationReason: String,
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userName: String,
        comment: String,
        commentedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    completedAt: Date,
    deadline: Date,
    isUrgent: {
      type: Boolean,
      default: false,
    },
    notificationsSent: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        sentAt: Date,
        type: String,
      },
    ],
    relatedRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApprovalRequest',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate request number
approvalRequestSchema.pre('save', async function (next) {
  if (!this.requestNumber) {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');
    this.requestNumber = `APR-${year}${month}-${random}`;
  }
  next();
});

// Indexes
approvalRequestSchema.index({ requestNumber: 1 });
approvalRequestSchema.index({ 'requestedBy.userId': 1 });
approvalRequestSchema.index({ overallStatus: 1 });
approvalRequestSchema.index({ requestType: 1 });
approvalRequestSchema.index({ currentApprovalLevel: 1 });
approvalRequestSchema.index({ submittedAt: -1 });
approvalRequestSchema.index({ deadline: 1 });

// Methods
approvalRequestSchema.methods.approve = async function (
  approverId,
  approverName,
  comments,
  signature
) {
  const currentLevel = this.approvalWorkflow.find(
    (level) => level.level === this.currentApprovalLevel
  );

  if (currentLevel) {
    currentLevel.status = 'Approved';
    currentLevel.approverId = approverId;
    currentLevel.approverName = approverName;
    currentLevel.comments = comments;
    currentLevel.actionDate = new Date();
    currentLevel.signature = signature;

    // Check if there are more approval levels
    if (this.currentApprovalLevel < this.approvalWorkflow.length) {
      this.currentApprovalLevel += 1;
      this.overallStatus = 'Under Review';
    } else {
      this.overallStatus = 'Approved';
      this.completedAt = new Date();
    }
  }

  return this.save();
};

approvalRequestSchema.methods.reject = async function (
  approverId,
  approverName,
  reason,
  comments
) {
  const currentLevel = this.approvalWorkflow.find(
    (level) => level.level === this.currentApprovalLevel
  );

  if (currentLevel) {
    currentLevel.status = 'Rejected';
    currentLevel.approverId = approverId;
    currentLevel.approverName = approverName;
    currentLevel.comments = comments;
    currentLevel.actionDate = new Date();
  }

  this.overallStatus = 'Rejected';
  this.rejectionReason = reason;
  this.completedAt = new Date();

  return this.save();
};

approvalRequestSchema.methods.addComment = function (userId, userName, comment) {
  this.comments.push({
    userId,
    userName,
    comment,
    commentedAt: new Date(),
  });
  return this.save();
};

approvalRequestSchema.methods.cancel = function (reason) {
  this.overallStatus = 'Cancelled';
  this.cancellationReason = reason;
  this.completedAt = new Date();
  return this.save();
};

const ApprovalRequest = mongoose.model('ApprovalRequest', approvalRequestSchema);

module.exports = ApprovalRequest;