const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    role: {
      type: String,
      enum: [
        'superadmin',
        'academic_admin_hod',
        'academic_admin_tp',
        'non_academic_faculty_head',
        'non_academic_team_rep',
        'faculty',
        'student',
      ],
      required: [true, 'Please specify a role'],
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: function () {
        return this.role !== 'superadmin';
      },
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: function () {
        return ['academic_admin_hod', 'faculty', 'student'].includes(this.role);
      },
    },
    studentBody: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentBody',
      required: function () {
        return ['non_academic_faculty_head', 'non_academic_team_rep'].includes(
          this.role
        );
      },
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === 'student' || this.role === 'superadmin';
      },
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ university: 1 });
userSchema.index({ department: 1 });
userSchema.index({ isApproved: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);