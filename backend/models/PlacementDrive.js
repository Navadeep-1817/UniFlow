const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      unique: true,
    },
    company: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      website: String,
      logo: String,
      industry: String,
      location: String,
      about: {
        type: String,
        maxlength: 2000,
      },
    },
    jobDetails: {
      jobRole: {
        type: String,
        required: true,
      },
      jobDescription: {
        type: String,
        maxlength: 2000,
      },
      jobType: {
        type: String,
        enum: ['Full Time', 'Internship', 'Part Time', 'Contract'],
        default: 'Full Time',
      },
      workMode: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        default: 'On-site',
      },
      openings: {
        type: Number,
        min: 1,
      },
    },
    package: {
      ctc: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'INR',
        },
      },
      breakup: {
        base: Number,
        variablePay: Number,
        perks: Number,
      },
      bondDetails: String,
    },
    eligibilityCriteria: {
      departments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department',
        },
      ],
      years: [Number],
      minimumCGPA: {
        type: Number,
        min: 0,
        max: 10,
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
      skills: [String],
      otherCriteria: String,
    },
    rounds: [
      {
        roundNumber: Number,
        name: {
          type: String,
          enum: [
            'Aptitude Test',
            'Technical Test',
            'Coding Round',
            'Group Discussion',
            'Technical Interview',
            'HR Interview',
            'Final Interview',
          ],
        },
        description: String,
        date: Date,
        time: String,
        venue: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Venue',
        },
        duration: Number, // in minutes
        mode: {
          type: String,
          enum: ['Offline', 'Online'],
          default: 'Offline',
        },
        link: String,
        selectedStudents: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    ],
    interviewSchedule: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        round: String,
        date: Date,
        time: String,
        venue: String,
        status: {
          type: String,
          enum: ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled'],
          default: 'Scheduled',
        },
      },
    ],
    results: {
      totalApplied: {
        type: Number,
        default: 0,
      },
      shortlisted: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      selected: [
        {
          studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          offerLetter: String,
          joiningDate: Date,
          package: Number,
          status: {
            type: String,
            enum: ['Offered', 'Accepted', 'Rejected', 'Joined'],
            default: 'Offered',
          },
        },
      ],
      rejected: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    documents: {
      jd: String, // Job Description
      companyPPT: String,
      otherDocs: [String],
    },
    contactPerson: {
      name: String,
      designation: String,
      email: String,
      phone: String,
    },
    driveStatus: {
      type: String,
      enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

placementDriveSchema.index({ eventId: 1 });
placementDriveSchema.index({ 'company.name': 1 });
placementDriveSchema.index({ driveStatus: 1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);