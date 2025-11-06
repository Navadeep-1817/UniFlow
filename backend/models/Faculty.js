const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
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
    designation: {
      type: String,
      enum: [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer',
        'Guest Faculty',
      ],
      required: true,
    },
    specialization: {
      type: String,
      maxlength: 200,
    },
    qualification: {
      type: String,
      required: true,
      maxlength: 200,
    },
    experience: {
      type: Number, // in years
      min: 0,
      default: 0,
    },
    subjects: [
      {
        type: String,
        maxlength: 100,
      },
    ],
    assignedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        slots: [
          {
            startTime: String,
            endTime: String,
            isAvailable: { type: Boolean, default: true },
          },
        ],
      },
    ],
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

facultySchema.index({ userId: 1 });
facultySchema.index({ employeeId: 1 });
facultySchema.index({ department: 1 });

module.exports = mongoose.model('Faculty', facultySchema);