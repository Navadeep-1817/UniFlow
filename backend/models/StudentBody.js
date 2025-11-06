const mongoose = require('mongoose');

const studentBodySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student body name'],
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
    type: {
      type: String,
      enum: ['Cultural', 'Technical', 'Sports', 'Social Service', 'Other'],
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    facultyHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    teamRepresentative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          default: 'Member',
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalMembers: {
      type: Number,
      default: 0,
    },
    budget: {
      allocated: {
        type: Number,
        default: 0,
      },
      spent: {
        type: Number,
        default: 0,
      },
      remaining: {
        type: Number,
        default: 0,
      },
    },
    establishedDate: {
      type: Date,
      default: Date.now,
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
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

studentBodySchema.index({ code: 1 });
studentBodySchema.index({ university: 1 });

module.exports = mongoose.model('StudentBody', studentBodySchema);