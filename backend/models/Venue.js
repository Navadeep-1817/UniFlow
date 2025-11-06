const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide venue name'],
      trim: true,
      maxlength: 200,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      maxlength: 20,
    },
    type: {
      type: String,
      enum: [
        'Classroom',
        'Laboratory',
        'Auditorium',
        'Seminar Hall',
        'Sports Ground',
        'Stadium',
        'Conference Room',
        'Open Area',
      ],
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      building: String,
      floor: String,
      block: String,
    },
    facilities: [
      {
        type: String,
        enum: [
          'Projector',
          'AC',
          'Whiteboard',
          'Smart Board',
          'Audio System',
          'Wi-Fi',
          'Computer Lab',
          'Video Conferencing',
        ],
      },
    ],
    availability: [
      {
        day: {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
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
    images: [String],
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

venueSchema.index({ university: 1, code: 1 }, { unique: true });
venueSchema.index({ type: 1 });

module.exports = mongoose.model('Venue', venueSchema);