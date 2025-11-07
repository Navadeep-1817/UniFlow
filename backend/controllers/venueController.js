// ============================================
// VENUE CONTROLLER - COMPLETE IMPLEMENTATION
// File: controllers/venueController.js
// ============================================

const Venue = require('../models/Venue');
const University = require('../models/University');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private (SuperAdmin, HOD, TP)
const createVenue = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    type,
    university,
    department,
    capacity,
    location,
    facilities,
    availability,
    images
  } = req.body;

  // Check if venue with same code exists in the university
  const existingVenue = await Venue.findOne({ university, code });
  if (existingVenue) {
    res.status(400);
    throw new Error('Venue with this code already exists in the university');
  }

  // Verify university exists
  const universityExists = await University.findById(university);
  if (!universityExists) {
    res.status(404);
    throw new Error('University not found');
  }

  const venue = await Venue.create({
    name,
    code: code.toUpperCase(),
    type,
    university,
    department,
    capacity,
    location,
    facilities,
    availability,
    images,
    createdBy: req.user._id
  });

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'CREATE',
    actionDescription: `Created venue ${name} (${code})`,
    module: 'Venue',
    entityType: 'Venue',
    entityId: venue._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  await venue.populate([
    { path: 'university', select: 'name' },
    { path: 'department', select: 'name code' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Venue created successfully',
    data: venue
  });
});

// @desc    Get all venues with filters
// @route   GET /api/venues
// @access  Private (All authenticated users)
const getAllVenues = asyncHandler(async (req, res) => {
  const {
    university,
    department,
    type,
    minCapacity,
    isActive,
    search,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query;

  const query = {};

  // Apply filters
  if (university) query.university = university;
  if (department) query.department = department;
  if (type) query.type = type;
  if (minCapacity) query.capacity = { $gte: parseInt(minCapacity) };
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { code: new RegExp(search, 'i') }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [venues, total] = await Promise.all([
    Venue.find(query)
      .populate('university', 'name')
      .populate('department', 'name code')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Venue.countDocuments(query)
  ]);

  res.json({
    success: true,
    count: venues.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: venues
  });
});

// @desc    Get venue by ID
// @route   GET /api/venues/:id
// @access  Private (All authenticated users)
const getVenueById = asyncHandler(async (req, res) => {
  const venue = await Venue.findById(req.params.id)
    .populate('university', 'name contact')
    .populate('department', 'name code')
    .populate('createdBy', 'name email');

  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  // Get upcoming events in this venue
  const upcomingEvents = await Event.find({
    venue: venue._id,
    status: { $in: ['Upcoming', 'Ongoing'] }
  })
    .populate('createdBy', 'name')
    .select('name startDate endDate category status')
    .sort('startDate')
    .limit(5);

  res.json({
    success: true,
    data: {
      ...venue.toObject(),
      upcomingEvents
    }
  });
});

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private (SuperAdmin, HOD, TP)
const updateVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findById(req.params.id);

  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  const changes = [];
  const allowedFields = [
    'name',
    'code',
    'type',
    'capacity',
    'location',
    'facilities',
    'availability',
    'images',
    'isActive'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      changes.push({
        field,
        oldValue: venue[field],
        newValue: req.body[field]
      });
      venue[field] = req.body[field];
    }
  });

  await venue.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'UPDATE',
    actionDescription: `Updated venue ${venue.name}`,
    module: 'Venue',
    entityType: 'Venue',
    entityId: venue._id,
    changes,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'INFO',
    isSuccessful: true
  });

  await venue.populate([
    { path: 'university', select: 'name' },
    { path: 'department', select: 'name code' }
  ]);

  res.json({
    success: true,
    message: 'Venue updated successfully',
    data: venue
  });
});

// @desc    Delete venue (soft delete)
// @route   DELETE /api/venues/:id
// @access  Private (SuperAdmin)
const deleteVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findById(req.params.id);

  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  // Check if venue has upcoming events
  const upcomingEventCount = await Event.countDocuments({
    venue: venue._id,
    status: { $in: ['Upcoming', 'Ongoing'] }
  });

  if (upcomingEventCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete venue with ${upcomingEventCount} upcoming/ongoing events. Please reassign them first.`
    );
  }

  // Soft delete
  venue.isActive = false;
  await venue.save();

  // Audit log
  await AuditLog.log({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    userEmail: req.user.email,
    action: 'DELETE',
    actionDescription: `Deactivated venue ${venue.name}`,
    module: 'Venue',
    entityType: 'Venue',
    entityId: venue._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'WARNING',
    isSuccessful: true
  });

  res.json({
    success: true,
    message: 'Venue deactivated successfully'
  });
});

// @desc    Check venue availability
// @route   POST /api/venues/:id/check-availability
// @access  Private (All authenticated users)
const checkAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;

  const venue = await Venue.findById(req.params.id);
  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide both startDate and endDate');
  }

  // Check for conflicting events
  const conflictingEvents = await Event.find({
    venue: venue._id,
    status: { $in: ['Upcoming', 'Ongoing'] },
    $or: [
      {
        // Event starts during the requested time
        startDate: { $gte: new Date(startDate), $lt: new Date(endDate) }
      },
      {
        // Event ends during the requested time
        endDate: { $gt: new Date(startDate), $lte: new Date(endDate) }
      },
      {
        // Event spans the entire requested time
        startDate: { $lte: new Date(startDate) },
        endDate: { $gte: new Date(endDate) }
      }
    ]
  })
    .populate('createdBy', 'name')
    .select('name startDate endDate category');

  const isAvailable = conflictingEvents.length === 0;

  res.json({
    success: true,
    data: {
      venueId: venue._id,
      venueName: venue.name,
      requestedPeriod: {
        start: startDate,
        end: endDate
      },
      isAvailable,
      conflictingEvents: isAvailable ? [] : conflictingEvents,
      message: isAvailable
        ? 'Venue is available for the requested time period'
        : `Venue has ${conflictingEvents.length} conflicting event(s)`
    }
  });
});

// @desc    Get venue bookings/events
// @route   GET /api/venues/:id/events
// @access  Private (All authenticated users)
const getVenueEvents = asyncHandler(async (req, res) => {
  const venue = await Venue.findById(req.params.id);

  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  const { status, startDate, endDate } = req.query;
  const query = { venue: venue._id };

  if (status) query.status = status;
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }

  const events = await Event.find(query)
    .populate('createdBy', 'name')
    .populate('department', 'name')
    .populate('studentBody', 'name')
    .sort('startDate');

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

module.exports = {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  checkAvailability,
  getVenueEvents
};
