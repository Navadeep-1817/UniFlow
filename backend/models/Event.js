const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
      maxlength: 2000,
    },
    eventCode: {
      type: String,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['Academic', 'NonAcademic'],
      required: true,
    },
    subType: {
      type: String,
      enum: [
        'FDP',
        'SDP',
        'CRT',
        'Workshop',
        'Seminar',
        'Conference',
        'Webinar',
        'Sports',
        'Cultural',
        'Technical',
        'Social',
        'Other',
      ],
      required: true,
    },
    category: {
      type: String,
      enum: ['Internal', 'External', 'Inter-College', 'National', 'International'],
      default: 'Internal',
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'organizerModel',
      required: true,
    },
    organizerModel: {
      type: String,
      enum: ['Department', 'StudentBody'],
      required: true,
    },
    coordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    date: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    time: {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
    sessions: [
      {
        sessionNumber: Number,
        title: String,
        description: String,
        date: Date,
        startTime: String,
        endTime: String,
        speaker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Trainer',
        },
        venue: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Venue',
        },
        topics: [String],
      },
    ],
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    mode: {
      type: String,
      enum: ['Offline', 'Online', 'Hybrid'],
      default: 'Offline',
    },
    onlineLink: {
      type: String,
      required: function () {
        return this.mode === 'Online' || this.mode === 'Hybrid';
      },
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
    },
    targetAudience: {
      departments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department',
        },
      ],
      years: [
        {
          type: Number,
          min: 1,
          max: 5,
        },
      ],
      specificStudents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      isOpenForAll: {
        type: Boolean,
        default: false,
      },
    },
    registration: {
      isRequired: {
        type: Boolean,
        default: true,
      },
      startDate: Date,
      endDate: Date,
      maxParticipants: {
        type: Number,
        min: 0,
      },
      currentParticipants: {
        type: Number,
        default: 0,
      },
      fees: {
        amount: {
          type: Number,
          default: 0,
        },
        currency: {
          type: String,
          default: 'INR',
        },
      },
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Pending',
        'Approved',
        'Rejected',
        'Upcoming',
        'Ongoing',
        'Completed',
        'Cancelled',
      ],
      default: 'Draft',
    },
    approval: {
      isApproved: {
        type: Boolean,
        default: false,
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      approvedAt: Date,
      rejectionReason: String,
    },
    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    poster: {
      type: String,
    },
    gallery: [String],
    budget: {
      estimated: {
        type: Number,
        default: 0,
      },
      actual: {
        type: Number,
        default: 0,
      },
    },
    attendance: {
      isRequired: {
        type: Boolean,
        default: true,
      },
      minimumPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 75,
      },
    },
    certificate: {
      isProvided: {
        type: Boolean,
        default: false,
      },
      templateId: String,
      criteria: {
        minimumAttendance: {
          type: Number,
          min: 0,
          max: 100,
          default: 75,
        },
      },
    },
    feedback: {
      isEnabled: {
        type: Boolean,
        default: true,
      },
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      totalResponses: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    outcomes: {
      type: String,
      maxlength: 2000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

// Generate unique event code before saving
eventSchema.pre('save', async function (next) {
  if (!this.eventCode) {
    const prefix = this.subType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    this.eventCode = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

// Update registration count
eventSchema.methods.updateParticipantCount = async function () {
  const Registration = mongoose.model('Registration');
  const count = await Registration.countDocuments({
    eventId: this._id,
    status: 'Registered',
  });
  this.registration.currentParticipants = count;
  await this.save();
};

// Check if registration is full
eventSchema.methods.isRegistrationFull = function () {
  if (!this.registration.maxParticipants) return false;
  return (
    this.registration.currentParticipants >= this.registration.maxParticipants
  );
};

// Indexes
eventSchema.index({ eventCode: 1 });
eventSchema.index({ university: 1, status: 1 });
eventSchema.index({ 'date.startDate': 1 });
eventSchema.index({ organizer: 1, organizerModel: 1 });
eventSchema.index({ type: 1, subType: 1 });

module.exports = mongoose.model('Event', eventSchema);