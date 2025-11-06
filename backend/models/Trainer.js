const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide trainer name'],
      trim: true,
      maxlength: 200,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
    },
    alternatePhone: String,
    type: {
      type: String,
      enum: ['Internal', 'External', 'Guest'],
      default: 'External',
    },
    organization: {
      type: String,
      maxlength: 200,
    },
    designation: {
      type: String,
      maxlength: 100,
    },
    qualification: {
      type: String,
      maxlength: 200,
    },
    experience: {
      type: Number, // in years
      min: 0,
    },
    expertise: [
      {
        domain: String,
        skills: [String],
        yearsOfExperience: Number,
      },
    ],
    specialization: [String],
    bio: {
      type: String,
      maxlength: 2000,
    },
    photo: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
      github: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    availability: [
      {
        date: Date,
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    ratings: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
    },
    eventsDelivered: {
      type: Number,
      default: 0,
    },
    lastEventDate: Date,
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      branch: String,
    },
    charges: {
      perSession: Number,
      perDay: Number,
      currency: {
        type: String,
        default: 'INR',
      },
    },
    documents: {
      resume: String,
      idProof: String,
      certificates: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
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

trainerSchema.index({ email: 1 });
trainerSchema.index({ phone: 1 });
trainerSchema.index({ type: 1 });
trainerSchema.index({ 'expertise.domain': 1 });

module.exports = mongoose.model('Trainer', trainerSchema);