const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      trim: true,
      maxlength: 200,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      maxlength: 20,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    totalFaculty: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    courses: [
      {
        name: String,
        duration: Number, // in years
        type: {
          type: String,
          enum: ['UG', 'PG', 'Diploma'],
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

departmentSchema.index({ university: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);