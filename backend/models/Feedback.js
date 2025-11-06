const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratings: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      content: {
        type: Number,
        min: 1,
        max: 5,
      },
      trainer: {
        type: Number,
        min: 1,
        max: 5,
      },
      venue: {
        type: Number,
        min: 1,
        max: 5,
      },
      organization: {
        type: Number,
        min: 1,
        max: 5,
      },
      materials: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    questions: [
      {
        question: String,
        answer: String,
        type: {
          type: String,
          enum: ['Text', 'Rating', 'Multiple Choice', 'Checkbox'],
        },
      },
    ],
    strengths: {
      type: String,
      maxlength: 1000,
    },
    improvements: {
      type: String,
      maxlength: 1000,
    },
    comments: {
      type: String,
      maxlength: 2000,
    },
    wouldRecommend: {
      type: Boolean,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// One feedback per student per event
feedbackSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
feedbackSchema.index({ 'ratings.overall': 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);