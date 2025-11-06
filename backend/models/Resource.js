const mongoose = require('mongoose');
const resourceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: [
        'Presentation',
        'Document',
        'Video',
        'Audio',
        'Image',
        'PDF',
        'Link',
        'Code',
        'Other',
      ],
      required: true,
    },
    fileUrl: {
      type: String,
      required: function () {
        return this.type !== 'Link';
      },
    },
    externalLink: {
      type: String,
      required: function () {
        return this.type === 'Link';
      },
    },
    fileName: String,
    fileSize: Number, // in bytes
    mimeType: String,
    cloudinaryId: String,
    sessionNumber: {
      type: Number,
      min: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    visibility: {
      type: String,
      enum: ['Public', 'Registered Only', 'Attended Only', 'Private'],
      default: 'Registered Only',
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
    isActive: {
      type
        : Boolean,
      default: true,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    accessibleTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    metadata: {
      duration: Number, // for video/audio in seconds
      pageCount: Number, // for documents/PDFs
      dimensions: {
        width: Number,
        height: Number,
      },
      language: String,
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: {
          type: String,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
resourceSchema.index({ eventId: 1, isActive: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ type: 1, visibility: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ createdAt: -1 });

// Virtual for calculating average rating
resourceSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(2);
  }
  return this.averageRating;
};

// Method to increment downloads
resourceSchema.methods.incrementDownloads = function () {
  this.downloads += 1;
  return this.save();
};

// Method to increment views
resourceSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Pre-save middleware to calculate average rating
resourceSchema.pre('save', function (next) {
  if (this.isModified('ratings')) {
    this.calculateAverageRating();
  }
  next();
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;