const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
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
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University is required'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
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
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
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

// Encrypt password before saving
trainerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match trainer entered password to hashed password in database
trainerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Trainer', trainerSchema);