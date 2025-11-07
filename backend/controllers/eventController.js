const Event = require('../models/Event');
const Registration = require('../models/Registration');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const {
    type,
    subType,
    category,
    status,
    mode,
    university,
    organizer,
    organizerModel,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10,
    sort = '-createdAt',
  } = req.query;

  // Build query
  const query = {};

  if (type) query.type = type;
  if (subType) query.subType = subType;
  if (category) query.category = category;
  if (status) query.status = status;
  if (mode) query.mode = mode;
  if (university) query.university = university;
  if (organizer) query.organizer = organizer;
  if (organizerModel) query.organizerModel = organizerModel;

  // Date range filter
  if (startDate || endDate) {
    query['date.startDate'] = {};
    if (startDate) query['date.startDate'].$gte = new Date(startDate);
    if (endDate) query['date.startDate'].$lte = new Date(endDate);
  }

  // Search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { eventCode: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const events = await Event.find(query)
    .populate('university', 'name code')
    .populate('organizer')
    .populate('coordinators', 'firstName lastName email')
    .populate('venue', 'name building capacity')
    .populate('trainer', 'name email organization')
    .populate('createdBy', 'firstName lastName email')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Event.countDocuments(query);

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: events,
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('university', 'name code')
    .populate('organizer')
    .populate('coordinators', 'firstName lastName email profilePicture')
    .populate('venue', 'name building capacity facilities')
    .populate('trainer', 'name email organization expertise bio')
    .populate('sessions.speaker', 'name email organization')
    .populate('sessions.venue', 'name building')
    .populate('targetAudience.departments', 'name code')
    .populate('targetAudience.specificStudents', 'firstName lastName email')
    .populate('resources')
    .populate('approval.approvedBy', 'firstName lastName')
    .populate('createdBy', 'firstName lastName email')
    .populate('updatedBy', 'firstName lastName');

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Faculty and above)
const createEvent = asyncHandler(async (req, res) => {
  // Set created by
  req.body.createdBy = req.user._id;
  req.body.university = req.user.university;

  // Set initial status based on user role
  if (
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP ||
    req.user.role === ROLES.NON_ACADEMIC_FACULTY_HEAD
  ) {
    req.body.status = 'Approved';
    req.body.approval = {
      isApproved: true,
      approvedBy: req.user._id,
      approvedAt: Date.now(),
    };
  } else {
    req.body.status = 'Pending';
  }

  // Validate dates
  if (new Date(req.body.date.endDate) < new Date(req.body.date.startDate)) {
    res.status(400);
    throw new Error('End date must be after start date');
  }

  // Validate registration dates if provided
  if (req.body.registration?.startDate && req.body.registration?.endDate) {
    if (
      new Date(req.body.registration.endDate) <
      new Date(req.body.registration.startDate)
    ) {
      res.status(400);
      throw new Error('Registration end date must be after start date');
    }
  }

  const event = await Event.create(req.body);

  // Populate response
  const populatedEvent = await Event.findById(event._id)
    .populate('university', 'name code')
    .populate('organizer')
    .populate('coordinators', 'firstName lastName email')
    .populate('venue', 'name building capacity')
    .populate('trainer', 'name email organization')
    .populate('createdBy', 'firstName lastName email');

  res.status(201).json({
    success: true,
    data: populatedEvent,
  });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check ownership or admin privileges
  const isOwner = event.createdBy.toString() === req.user._id.toString();
  const isCoordinator = event.coordinators.some(
    (coord) => coord.toString() === req.user._id.toString()
  );
  const isAdmin =
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP ||
    req.user.role === ROLES.NON_ACADEMIC_FACULTY_HEAD;

  if (!isOwner && !isCoordinator && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this event');
  }

  // Don't allow updating status directly
  delete req.body.status;
  delete req.body.approval;

  // Set updated by
  req.body.updatedBy = req.user._id;

  // Validate dates if provided
  if (req.body.date) {
    const startDate = req.body.date.startDate || event.date.startDate;
    const endDate = req.body.date.endDate || event.date.endDate;
    if (new Date(endDate) < new Date(startDate)) {
      res.status(400);
      throw new Error('End date must be after start date');
    }
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('university', 'name code')
    .populate('organizer')
    .populate('coordinators', 'firstName lastName email')
    .populate('venue', 'name building capacity')
    .populate('trainer', 'name email organization')
    .populate('updatedBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check ownership or admin privileges
  const isOwner = event.createdBy.toString() === req.user._id.toString();
  const isAdmin =
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP ||
    req.user.role === ROLES.NON_ACADEMIC_FACULTY_HEAD;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this event');
  }

  // Check if event has registrations
  const registrationCount = await Registration.countDocuments({
    eventId: event._id,
  });

  if (registrationCount > 0 && event.status !== 'Draft') {
    res.status(400);
    throw new Error(
      'Cannot delete event with registrations. Please cancel the event instead.'
    );
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Event deleted successfully',
  });
});

// @desc    Approve event
// @route   PUT /api/events/:id/approve
// @access  Private (Admin only)
const approveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.status !== 'Pending') {
    res.status(400);
    throw new Error('Only pending events can be approved');
  }

  event.status = 'Approved';
  event.approval = {
    isApproved: true,
    approvedBy: req.user._id,
    approvedAt: Date.now(),
  };

  await event.save();

  const populatedEvent = await Event.findById(event._id)
    .populate('approval.approvedBy', 'firstName lastName')
    .populate('createdBy', 'firstName lastName email');

  res.status(200).json({
    success: true,
    data: populatedEvent,
    message: 'Event approved successfully',
  });
});

// @desc    Reject event
// @route   PUT /api/events/:id/reject
// @access  Private (Admin only)
const rejectEvent = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  if (!rejectionReason) {
    res.status(400);
    throw new Error('Please provide rejection reason');
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.status !== 'Pending') {
    res.status(400);
    throw new Error('Only pending events can be rejected');
  }

  event.status = 'Rejected';
  event.approval = {
    isApproved: false,
    approvedBy: req.user._id,
    approvedAt: Date.now(),
    rejectionReason,
  };

  await event.save();

  const populatedEvent = await Event.findById(event._id)
    .populate('approval.approvedBy', 'firstName lastName')
    .populate('createdBy', 'firstName lastName email');

  res.status(200).json({
    success: true,
    data: populatedEvent,
    message: 'Event rejected',
  });
});

// @desc    Cancel event
// @route   PUT /api/events/:id/cancel
// @access  Private
const cancelEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check ownership or admin privileges
  const isOwner = event.createdBy.toString() === req.user._id.toString();
  const isAdmin =
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP ||
    req.user.role === ROLES.NON_ACADEMIC_FACULTY_HEAD;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to cancel this event');
  }

  if (event.status === 'Completed' || event.status === 'Cancelled') {
    res.status(400);
    throw new Error(`Event is already ${event.status.toLowerCase()}`);
  }

  event.status = 'Cancelled';
  event.updatedBy = req.user._id;
  await event.save();

  res.status(200).json({
    success: true,
    data: event,
    message: 'Event cancelled successfully',
  });
});

// @desc    Publish event (change from Draft to Pending)
// @route   PUT /api/events/:id/publish
// @access  Private
const publishEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check ownership
  const isOwner = event.createdBy.toString() === req.user._id.toString();
  const isAdmin =
    req.user.role === ROLES.SUPER_ADMIN ||
    req.user.role === ROLES.ACADEMIC_ADMIN_HOD ||
    req.user.role === ROLES.ACADEMIC_ADMIN_TP ||
    req.user.role === ROLES.NON_ACADEMIC_FACULTY_HEAD;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to publish this event');
  }

  if (event.status !== 'Draft') {
    res.status(400);
    throw new Error('Only draft events can be published');
  }

  // Auto-approve if user is admin
  if (isAdmin) {
    event.status = 'Approved';
    event.approval = {
      isApproved: true,
      approvedBy: req.user._id,
      approvedAt: Date.now(),
    };
  } else {
    event.status = 'Pending';
  }

  event.updatedBy = req.user._id;
  await event.save();

  res.status(200).json({
    success: true,
    data: event,
    message: 'Event published successfully',
  });
});

// @desc    Get my events
// @route   GET /api/events/my/events
// @access  Private
const getMyEvents = asyncHandler(async (req, res) => {
  const { status, type, page = 1, limit = 10 } = req.query;

  const query = {
    $or: [
      { createdBy: req.user._id },
      { coordinators: req.user._id },
    ],
  };

  if (status) query.status = status;
  if (type) query.type = type;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const events = await Event.find(query)
    .populate('university', 'name code')
    .populate('organizer')
    .populate('venue', 'name building')
    .sort('-createdAt')
    .skip(skip)
    .limit(limitNum);

  const total = await Event.countDocuments(query);

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: events,
  });
});

// @desc    Get pending events for approval
// @route   GET /api/events/pending/approval
// @access  Private (Admin only)
const getPendingEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const query = {
    status: 'Pending',
    university: req.user.university,
  };

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const events = await Event.find(query)
    .populate('organizer')
    .populate('coordinators', 'firstName lastName email')
    .populate('venue', 'name building')
    .populate('createdBy', 'firstName lastName email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limitNum);

  const total = await Event.countDocuments(query);

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: events,
  });
});

// @desc    Get event statistics
// @route   GET /api/events/:id/stats
// @access  Private
const getEventStats = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Get registration stats
  const totalRegistrations = await Registration.countDocuments({
    eventId: event._id,
  });

  const registeredCount = await Registration.countDocuments({
    eventId: event._id,
    status: 'Registered',
  });

  const waitlistedCount = await Registration.countDocuments({
    eventId: event._id,
    status: 'Waitlisted',
  });

  const cancelledCount = await Registration.countDocuments({
    eventId: event._id,
    status: 'Cancelled',
  });

  // Get attendance stats if available
  const attendanceStats = await Registration.aggregate([
    {
      $match: {
        eventId: event._id,
        status: 'Registered',
      },
    },
    {
      $group: {
        _id: null,
        totalAttendance: { $sum: '$attendancePercentage' },
        count: { $sum: 1 },
      },
    },
  ]);

  const averageAttendance =
    attendanceStats.length > 0
      ? (attendanceStats[0].totalAttendance / attendanceStats[0].count).toFixed(2)
      : 0;

  res.status(200).json({
    success: true,
    data: {
      event: {
        id: event._id,
        title: event.title,
        eventCode: event.eventCode,
        status: event.status,
      },
      registrations: {
        total: totalRegistrations,
        registered: registeredCount,
        waitlisted: waitlistedCount,
        cancelled: cancelledCount,
        capacity: event.registration.maxParticipants || 'Unlimited',
        remainingSlots: event.registration.maxParticipants
          ? event.registration.maxParticipants - registeredCount
          : 'Unlimited',
      },
      attendance: {
        averagePercentage: parseFloat(averageAttendance),
        minimumRequired: event.attendance.minimumPercentage,
      },
      feedback: {
        averageRating: event.feedback.averageRating,
        totalResponses: event.feedback.totalResponses,
      },
    },
  });
});

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  cancelEvent,
  publishEvent,
  getMyEvents,
  getPendingEvents,
  getEventStats,
};