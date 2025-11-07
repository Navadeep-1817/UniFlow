const Timetable = require('../models/Timetable');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('express-async-handler');

// @desc    Create new timetable
// @route   POST /api/timetables
// @access  Private (Admin)
const createTimetable = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    department,
    semester,
    academicYear,
    schedule,
    breakTimings,
    holidays
  } = req.body;

  // Validate department
  if (department) {
    const dept = await Department.findById(department);
    if (!dept) {
      res.status(404);
      throw new Error('Department not found');
    }
  }

  // Check for existing active timetable
  const existingTimetable = await Timetable.findOne({
    type,
    department,
    semester,
    academicYear,
    status: 'Active'
  });

  if (existingTimetable) {
    res.status(400);
    throw new Error('An active timetable already exists for this configuration');
  }

  const timetable = await Timetable.create({
    title,
    description,
    type,
    department,
    semester,
    academicYear,
    schedule,
    breakTimings,
    holidays,
    createdBy: req.user._id
  });

  await timetable.populate('department', 'name code');

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'CREATE',
    category: 'TIMETABLE',
    details: {
      timetableId: timetable._id,
      title,
      type,
      department: department || 'All'
    }
  });

  res.status(201).json({
    success: true,
    data: timetable
  });
});

// @desc    Get all timetables
// @route   GET /api/timetables
// @access  Private
const getAllTimetables = asyncHandler(async (req, res) => {
  const {
    type,
    department,
    semester,
    academicYear,
    status,
    search,
    sortBy = '-createdAt',
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  // Type filter
  if (type) {
    query.type = type;
  }

  // Department filter
  if (department) {
    query.department = department;
  } else if (req.user.role === 'Faculty') {
    // Faculty can only see their department's timetable
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (faculty) {
      query.department = faculty.department;
    }
  }

  // Semester filter
  if (semester) {
    query.semester = semester;
  }

  // Academic year filter
  if (academicYear) {
    query.academicYear = academicYear;
  }

  // Status filter
  if (status) {
    query.status = status;
  }

  // Search filter
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const timetables = await Timetable.find(query)
    .populate('department', 'name code')
    .populate('createdBy', 'name email')
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  const total = await Timetable.countDocuments(query);

  res.status(200).json({
    success: true,
    count: timetables.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: timetables
  });
});

// @desc    Get single timetable
// @route   GET /api/timetables/:id
// @access  Private
const getTimetableById = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id)
    .populate('department', 'name code')
    .populate('schedule.slots.event', 'title type')
    .populate('schedule.slots.venue', 'name building capacity')
    .populate('schedule.slots.faculty', 'user')
    .populate('schedule.slots.trainer', 'user')
    .populate('conflicts.event', 'title')
    .populate('conflicts.venue', 'name')
    .populate('conflicts.faculty', 'user')
    .populate('conflicts.trainer', 'user')
    .populate('createdBy', 'name email');

  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc    Update timetable
// @route   PUT /api/timetables/:id
// @access  Private (Admin)
const updateTimetable = asyncHandler(async (req, res) => {
  let timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  const {
    title,
    description,
    schedule,
    breakTimings,
    holidays,
    status
  } = req.body;

  // Validate department if changed
  if (req.body.department) {
    const dept = await Department.findById(req.body.department);
    if (!dept) {
      res.status(404);
      throw new Error('Department not found');
    }
  }

  timetable = await Timetable.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      schedule,
      breakTimings,
      holidays,
      status
    },
    { new: true, runValidators: true }
  );

  await timetable.populate('department', 'name code');

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'UPDATE',
    category: 'TIMETABLE',
    details: {
      timetableId: timetable._id,
      title: timetable.title
    }
  });

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc    Delete timetable
// @route   DELETE /api/timetables/:id
// @access  Private (Admin)
const deleteTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  // Archive instead of delete if active
  if (timetable.status === 'Active') {
    timetable.status = 'Archived';
    await timetable.save();

    // Audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'ARCHIVE',
      category: 'TIMETABLE',
      details: {
        timetableId: timetable._id,
        title: timetable.title
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Timetable archived successfully'
    });
  }

  await timetable.deleteOne();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'DELETE',
    category: 'TIMETABLE',
    details: {
      timetableId: req.params.id,
      title: timetable.title
    }
  });

  res.status(200).json({
    success: true,
    message: 'Timetable deleted'
  });
});

// @desc    Add event to timetable
// @route   POST /api/timetables/:id/events
// @access  Private (Admin)
const addEventToTimetable = asyncHandler(async (req, res) => {
  const { eventId, day, startTime, endTime, venue, faculty, trainer, type } = req.body;

  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  // Validate event
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Validate venue if provided
  if (venue) {
    const venueDoc = await Venue.findById(venue);
    if (!venueDoc) {
      res.status(404);
      throw new Error('Venue not found');
    }
  }

  // Use model method to add event
  try {
    await timetable.addEvent(eventId, day, startTime, endTime, venue, faculty, trainer, type);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

  await timetable.populate([
    { path: 'schedule.slots.event', select: 'title type' },
    { path: 'schedule.slots.venue', select: 'name building' }
  ]);

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'ADD_EVENT',
    category: 'TIMETABLE',
    details: {
      timetableId: timetable._id,
      eventId,
      day,
      startTime,
      endTime
    }
  });

  res.status(200).json({
    success: true,
    message: 'Event added to timetable',
    data: timetable
  });
});

// @desc    Remove event from timetable
// @route   DELETE /api/timetables/:id/events/:slotId
// @access  Private (Admin)
const removeEventFromTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  // Use model method to remove event
  try {
    await timetable.removeEvent(req.params.slotId);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'REMOVE_EVENT',
    category: 'TIMETABLE',
    details: {
      timetableId: timetable._id,
      slotId: req.params.slotId
    }
  });

  res.status(200).json({
    success: true,
    message: 'Event removed from timetable',
    data: timetable
  });
});

// @desc    Detect and get conflicts in timetable
// @route   GET /api/timetables/:id/conflicts
// @access  Private (Admin)
const detectConflicts = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  // Use model method to detect conflicts
  await timetable.detectConflicts();

  await timetable.populate([
    { path: 'conflicts.event', select: 'title type' },
    { path: 'conflicts.venue', select: 'name building' },
    { path: 'conflicts.faculty', select: 'user' },
    { path: 'conflicts.trainer', select: 'user' }
  ]);

  res.status(200).json({
    success: true,
    conflictCount: timetable.conflicts.length,
    data: timetable.conflicts
  });
});

// @desc    Resolve conflict
// @route   PUT /api/timetables/:id/conflicts/:conflictId
// @access  Private (Admin)
const resolveConflict = asyncHandler(async (req, res) => {
  const { resolution } = req.body;

  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  const conflict = timetable.conflicts.id(req.params.conflictId);
  if (!conflict) {
    res.status(404);
    throw new Error('Conflict not found');
  }

  conflict.isResolved = true;
  conflict.resolution = resolution;
  conflict.resolvedAt = Date.now();

  await timetable.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'RESOLVE_CONFLICT',
    category: 'TIMETABLE',
    details: {
      timetableId: timetable._id,
      conflictId: req.params.conflictId,
      resolution
    }
  });

  res.status(200).json({
    success: true,
    message: 'Conflict resolved',
    data: conflict
  });
});

// @desc    Publish timetable
// @route   PUT /api/timetables/:id/publish
// @access  Private (Admin)
const publishTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  // Check for unresolved conflicts
  const unresolvedConflicts = timetable.conflicts.filter(c => !c.isResolved);
  if (unresolvedConflicts.length > 0) {
    res.status(400);
    throw new Error(`Cannot publish timetable with ${unresolvedConflicts.length} unresolved conflicts`);
  }

  // Use model method to publish
  await timetable.publish();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'PUBLISH',
    category: 'TIMETABLE',
    details: {
      timetableId: timetable._id,
      title: timetable.title
    }
  });

  res.status(200).json({
    success: true,
    message: 'Timetable published successfully',
    data: timetable
  });
});

// @desc    Archive timetable
// @route   PUT /api/timetables/:id/archive
// @access  Private (Admin)
const archiveTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(404);
    throw new Error('Timetable not found');
  }

  // Use model method to archive
  await timetable.archive();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'ARCHIVE',
    category: 'TIMETABLE',
    details: {
      timetableId: timetable._id,
      title: timetable.title
    }
  });

  res.status(200).json({
    success: true,
    message: 'Timetable archived successfully',
    data: timetable
  });
});

// @desc    Check venue availability
// @route   GET /api/timetables/check-venue
// @access  Private
const checkVenueAvailability = asyncHandler(async (req, res) => {
  const { venueId, day, startTime, endTime, timetableId } = req.query;

  if (!venueId || !day || !startTime || !endTime) {
    res.status(400);
    throw new Error('Please provide venueId, day, startTime, and endTime');
  }

  // Use static method
  const isAvailable = await Timetable.checkVenueAvailability(
    venueId,
    day,
    startTime,
    endTime,
    timetableId
  );

  res.status(200).json({
    success: true,
    available: isAvailable,
    venue: venueId,
    day,
    startTime,
    endTime
  });
});

// @desc    Check faculty availability
// @route   GET /api/timetables/check-faculty
// @access  Private
const checkFacultyAvailability = asyncHandler(async (req, res) => {
  const { facultyId, day, startTime, endTime, timetableId } = req.query;

  if (!facultyId || !day || !startTime || !endTime) {
    res.status(400);
    throw new Error('Please provide facultyId, day, startTime, and endTime');
  }

  // Use static method
  const isAvailable = await Timetable.checkFacultyAvailability(
    facultyId,
    day,
    startTime,
    endTime,
    timetableId
  );

  res.status(200).json({
    success: true,
    available: isAvailable,
    faculty: facultyId,
    day,
    startTime,
    endTime
  });
});

module.exports = {
  createTimetable,
  getAllTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  addEventToTimetable,
  removeEventFromTimetable,
  detectConflicts,
  resolveConflict,
  publishTimetable,
  archiveTimetable,
  checkVenueAvailability,
  checkFacultyAvailability
};
