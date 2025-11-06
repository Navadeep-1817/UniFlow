const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide university name'],
      unique: true,
      trim: true,
      maxlength: 200,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      maxlength: 20,
    },
    address: {
      street: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
      },
      country: {
        type: String,
        default: 'India',
      },
    },
    contact: {
      phone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
      },
      email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
      website: String,
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/200',
    },
    establishedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    affiliationType: {
      type: String,
      enum: ['Autonomous', 'Affiliated', 'Deemed University', 'Central University'],
    },
    totalDepartments: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    totalFaculty: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

universitySchema.index({ code: 1 });
universitySchema.index({ name: 1 });

module.exports = mongoose.model('University', universitySchema);