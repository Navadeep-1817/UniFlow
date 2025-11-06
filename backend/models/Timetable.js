const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      enum: ['Odd', 'Even', 'Summer', 'Annual'],
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    type: {
      type: String,
      enum: ['Regular Classes', 'Events', 'Examinations', 'Mixed'],
      default: 'Mixed',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    schedule: [
      {
        dayOfWeek: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true,
        },
        date: Date,
        slots: [
          {
            slotNumber: Number,
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
            duration: Number, // in minutes
            activityType: {
              type: String,
              enum: ['Class', 'Event', 'Lab', 'Break', 'Examination', 'Other'],
            },
            eventId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Event',
            },
            eventName: String,
            eventType: String,
            venueId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Venue',
            },
            venueName: String,
            trainerId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Trainer',
            },
            trainerName: String,
            facultyId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            facultyName: String,
            subject: String,
            topic: String,
            targetAudience: {
              departments: [String],
              years: [String],
              sections: [String],
              specificGroups: [String],
            },
            capacity: Number,
            registered: {
              type: Number,
              default: 0,
            },
            status: {
              type: String,
              enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled', 'Postponed'],
              default: 'Scheduled',
            },
            isMandatory: {
              type: Boolean,
              default: false,
            },
            notes: String,
            resources: [
              {
                title: String,
                url: String,
                type: String,
              },
            ],
          },
        ],
      },
    ],
    conflicts: [
      {
        type: {
          type: String,
          enum: ['Venue', 'Faculty', 'Student Group', 'Trainer'],
        },
        description: String,
        slot1: {
          day: String,
          time: String,
          activity: String,
        },
        slot2: {
          day: String,
          time: String,
          activity: String,
        },
        severity: {
          type: String,
          enum: ['Minor', 'Major', 'Critical'],
        },
        resolved: {
          type: Boolean,
          default: false,
        },
        resolvedAt: Date,
        resolvedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    breakTimings: [
      {
        name: String,
        startTime: String,
        endTime: String,
        duration: Number,
        days: [String],
      },
    ],
    workingDays: [String],
    holidays: [
      {
        date: Date,
        name: String,
        type: {
          type: String,
          enum: ['Public Holiday', 'University Holiday', 'Department Holiday', 'Other'],
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
    publishedAt: Date,
    version: {
      type: Number,
      default: 1,
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

// Indexes
timetableSchema.index({ departmentId: 1, academicYear: 1, semester: 1 });
timetableSchema.index({ startDate: 1, endDate: 1 });
timetableSchema.index({ status: 1, isActive: 1 });
timetableSchema.index({ 'schedule.slots.eventId': 1 });
timetableSchema.index({ 'schedule.slots.venueId': 1 });

// Methods
// Methods
timetableSchema.methods.detectConflicts = async function () {
  const conflicts = [];
  const venueMap = new Map();
  const facultyMap = new Map();
  const trainerMap = new Map();

  this.schedule.forEach((day) => {
    day.slots.forEach((slot) => {
      const timeKey = `${day.dayOfWeek}-${slot.startTime}-${slot.endTime}`;

      // Check venue conflicts
      if (slot.venueId) {
        const venueKey = `${slot.venueId}-${timeKey}`;
        if (venueMap.has(venueKey)) {
          conflicts.push({
            type: 'Venue',
            description: `Venue ${slot.venueName} is double-booked`,
            slot1: venueMap.get(venueKey),
            slot2: {
              day: day.dayOfWeek,
              time: `${slot.startTime} - ${slot.endTime}`,
              activity: slot.eventName || slot.subject,
            },
            severity: 'Critical',
            resolved: false,
          });
        } else {
          venueMap.set(venueKey, {
            day: day.dayOfWeek,
            time: `${slot.startTime} - ${slot.endTime}`,
            activity: slot.eventName || slot.subject,
          });
        }
      }

      // Check faculty conflicts
      if (slot.facultyId) {
        const facultyKey = `${slot.facultyId}-${timeKey}`;
        if (facultyMap.has(facultyKey)) {
          conflicts.push({
            type: 'Faculty',
            description: `Faculty ${slot.facultyName} has overlapping assignments`,
            slot1: facultyMap.get(facultyKey),
            slot2: {
              day: day.dayOfWeek,
              time: `${slot.startTime} - ${slot.endTime}`,
              activity: slot.eventName || slot.subject,
            },
            severity: 'Major',
            resolved: false,
          });
        } else {
          facultyMap.set(facultyKey, {
            day: day.dayOfWeek,
            time: `${slot.startTime} - ${slot.endTime}`,
            activity: slot.eventName || slot.subject,
          });
        }
      }

      // Check trainer conflicts
      if (slot.trainerId) {
        const trainerKey = `${slot.trainerId}-${timeKey}`;
        if (trainerMap.has(trainerKey)) {
          conflicts.push({
            type: 'Trainer',
            description: `Trainer ${slot.trainerName} has overlapping sessions`,
            slot1: trainerMap.get(trainerKey),
            slot2: {
              day: day.dayOfWeek,
              time: `${slot.startTime} - ${slot.endTime}`,
              activity: slot.eventName,
            },
            severity: 'Critical',
            resolved: false,
          });
        } else {
          trainerMap.set(trainerKey, {
            day: day.dayOfWeek,
            time: `${slot.startTime} - ${slot.endTime}`,
            activity: slot.eventName,
          });
        }
      }
    });
  });

  this.conflicts = conflicts;
  return this.save();
};

timetableSchema.methods.addEvent = function (dayOfWeek, slotData) {
  const day = this.schedule.find((d) => d.dayOfWeek === dayOfWeek);
  
  if (day) {
    day.slots.push(slotData);
  } else {
    this.schedule.push({
      dayOfWeek,
      slots: [slotData],
    });
  }

  return this.detectConflicts();
};

timetableSchema.methods.removeEvent = function (eventId) {
  this.schedule.forEach((day) => {
    day.slots = day.slots.filter((slot) => !slot.eventId || slot.eventId.toString() !== eventId.toString());
  });

  return this.save();
};

timetableSchema.methods.updateSlotStatus = function (dayOfWeek, slotNumber, status) {
  const day = this.schedule.find((d) => d.dayOfWeek === dayOfWeek);
  
  if (day) {
    const slot = day.slots.find((s) => s.slotNumber === slotNumber);
    if (slot) {
      slot.status = status;
    }
  }

  return this.save();
};

timetableSchema.methods.publish = function () {
  this.status = 'Published';
  this.publishedAt = new Date();
  return this.save();
};

timetableSchema.methods.archive = function () {
  this.status = 'Archived';
  this.isActive = false;
  return this.save();
};

timetableSchema.methods.getAvailableSlots = function (dayOfWeek, venueId) {
  const day = this.schedule.find((d) => d.dayOfWeek === dayOfWeek);
  
  if (!day) return [];

  const occupiedSlots = day.slots
    .filter((slot) => slot.venueId && slot.venueId.toString() === venueId.toString())
    .map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

  return occupiedSlots;
};

// Static methods
timetableSchema.statics.checkVenueAvailability = async function (venueId, dayOfWeek, startTime, endTime, excludeTimetableId) {
  const query = {
    'schedule.dayOfWeek': dayOfWeek,
    'schedule.slots.venueId': venueId,
    status: 'Published',
    isActive: true,
  };

  if (excludeTimetableId) {
    query._id = { $ne: excludeTimetableId };
  }

  const timetables = await this.find(query);

  for (const timetable of timetables) {
    for (const day of timetable.schedule) {
      if (day.dayOfWeek === dayOfWeek) {
        for (const slot of day.slots) {
          if (slot.venueId && slot.venueId.toString() === venueId.toString()) {
            // Check for time overlap
            if (
              (startTime >= slot.startTime && startTime < slot.endTime) ||
              (endTime > slot.startTime && endTime <= slot.endTime) ||
              (startTime <= slot.startTime && endTime >= slot.endTime)
            ) {
              return {
                available: false,
                conflictingSlot: slot,
                conflictingTimetable: timetable,
              };
            }
          }
        }
      }
    }
  }

  return { available: true };
};

timetableSchema.statics.checkFacultyAvailability = async function (facultyId, dayOfWeek, startTime, endTime, excludeTimetableId) {
  const query = {
    'schedule.dayOfWeek': dayOfWeek,
    'schedule.slots.facultyId': facultyId,
    status: 'Published',
    isActive: true,
  };

  if (excludeTimetableId) {
    query._id = { $ne: excludeTimetableId };
  }

  const timetables = await this.find(query);

  for (const timetable of timetables) {
    for (const day of timetable.schedule) {
      if (day.dayOfWeek === dayOfWeek) {
        for (const slot of day.slots) {
          if (slot.facultyId && slot.facultyId.toString() === facultyId.toString()) {
            // Check for time overlap
            if (
              (startTime >= slot.startTime && startTime < slot.endTime) ||
              (endTime > slot.startTime && endTime <= slot.endTime) ||
              (startTime <= slot.startTime && endTime >= slot.endTime)
            ) {
              return {
                available: false,
                conflictingSlot: slot,
                conflictingTimetable: timetable,
              };
            }
          }
        }
      }
    }
  }

  return { available: true };
};

timetableSchema.statics.getActiveEvents = async function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        status: 'Published',
        isActive: true,
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    },
    {
      $unwind: '$schedule',
    },
    {
      $unwind: '$schedule.slots',
    },
    {
      $match: {
        'schedule.slots.eventId': { $exists: true },
        'schedule.slots.status': { $in: ['Scheduled', 'Ongoing'] },
      },
    },
    {
      $project: {
        dayOfWeek: '$schedule.dayOfWeek',
        date: '$schedule.date',
        slot: '$schedule.slots',
        academicYear: 1,
        semester: 1,
        departmentId: 1,
      },
    },
    {
      $sort: { date: 1, 'slot.startTime': 1 },
    },
  ]);
};

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;