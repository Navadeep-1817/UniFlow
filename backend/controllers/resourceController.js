const Resource = require('../models/Resource');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('express-async-handler');

// @desc    Upload/Create resource
// @route   POST /api/resources
// @access  Private (Admin, Faculty, Trainer)
const uploadResource = asyncHandler(async (req, res) => {
  const {
    eventId,
    title,
    description,
    type,
    fileUrl,
    fileSize,
    mimeType,
    visibility,
    accessibleTo,
    tags
  } = req.body;

  // Validate event
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user has permission for this event
  const isEventOrganizer = event.organizers.some(
    org => org.toString() === req.user._id.toString()
  );
  
  if (!isEventOrganizer && !['Super Admin', 'Academic Admin'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Not authorized to upload resources for this event');
  }

  const resource = await Resource.create({
    eventId,
    title,
    description,
    type,
    fileUrl,
    fileSize,
    mimeType,
    visibility,
    accessibleTo,
    tags,
    uploadedBy: req.user._id
  });

  await resource.populate([
    { path: 'eventId', select: 'title type startDate' },
    { path: 'uploadedBy', select: 'name email role' }
  ]);

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'UPLOAD',
    category: 'RESOURCE',
    details: {
      resourceId: resource._id,
      title,
      eventId,
      type,
      visibility
    }
  });

  res.status(201).json({
    success: true,
    data: resource
  });
});

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getAllResources = asyncHandler(async (req, res) => {
  const {
    eventId,
    type,
    visibility,
    search,
    tags,
    sortBy = '-uploadedAt',
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  // Event filter
  if (eventId) {
    query.eventId = eventId;
  }

  // Type filter
  if (type) {
    query.type = type;
  }

  // Visibility filter - apply access control
  if (req.user.role === 'Student') {
    // Students can only see resources they have access to
    query.$or = [
      { visibility: 'Public' },
      { accessibleTo: req.user._id }
    ];

    // Check for registered/attended events
    if (eventId) {
      const registration = await Registration.findOne({
        user: req.user._id,
        event: eventId
      });

      if (registration) {
        query.$or.push({ visibility: 'Registered Only' });

        // Check if attended
        const attendance = await Attendance.findOne({
          event: eventId,
          'attendees.user': req.user._id,
          'attendees.status': 'Present'
        });

        if (attendance) {
          query.$or.push({ visibility: 'Attended Only' });
        }
      }
    }
  } else if (visibility) {
    // Admin/Faculty can filter by specific visibility
    query.visibility = visibility;
  }

  // Search filter
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ];
  }

  // Tags filter
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    query.tags = { $in: tagArray };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const resources = await Resource.find(query)
    .populate('eventId', 'title type startDate endDate')
    .populate('uploadedBy', 'name email role')
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  const total = await Resource.countDocuments(query);

  res.status(200).json({
    success: true,
    count: resources.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: resources
  });
});

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
    .populate('eventId', 'title type startDate endDate organizers')
    .populate('uploadedBy', 'name email role')
    .populate('ratings.user', 'name')
    .populate('comments.user', 'name');

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Check access permission
  let hasAccess = false;

  if (['Super Admin', 'Academic Admin', 'Non-Academic Admin'].includes(req.user.role)) {
    hasAccess = true;
  } else if (resource.visibility === 'Public') {
    hasAccess = true;
  } else if (resource.accessibleTo.includes(req.user._id)) {
    hasAccess = true;
  } else if (resource.uploadedBy._id.toString() === req.user._id.toString()) {
    hasAccess = true;
  } else if (resource.visibility === 'Registered Only') {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: resource.eventId._id
    });
    if (registration) hasAccess = true;
  } else if (resource.visibility === 'Attended Only') {
    const attendance = await Attendance.findOne({
      event: resource.eventId._id,
      'attendees.user': req.user._id,
      'attendees.status': 'Present'
    });
    if (attendance) hasAccess = true;
  }

  if (!hasAccess) {
    res.status(403);
    throw new Error('You do not have access to this resource');
  }

  res.status(200).json({
    success: true,
    data: resource
  });
});

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Owner, Admin)
const updateResource = asyncHandler(async (req, res) => {
  let resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Check permission
  if (
    resource.uploadedBy.toString() !== req.user._id.toString() &&
    !['Super Admin', 'Academic Admin'].includes(req.user.role)
  ) {
    res.status(403);
    throw new Error('Not authorized to update this resource');
  }

  const {
    title,
    description,
    type,
    fileUrl,
    fileSize,
    mimeType,
    visibility,
    accessibleTo,
    tags
  } = req.body;

  resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      type,
      fileUrl,
      fileSize,
      mimeType,
      visibility,
      accessibleTo,
      tags
    },
    { new: true, runValidators: true }
  );

  await resource.populate([
    { path: 'eventId', select: 'title type' },
    { path: 'uploadedBy', select: 'name email' }
  ]);

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'UPDATE',
    category: 'RESOURCE',
    details: {
      resourceId: resource._id,
      title: resource.title
    }
  });

  res.status(200).json({
    success: true,
    data: resource
  });
});

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Owner, Admin)
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Check permission
  if (
    resource.uploadedBy.toString() !== req.user._id.toString() &&
    !['Super Admin', 'Academic Admin'].includes(req.user.role)
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this resource');
  }

  // Soft delete
  resource.isActive = false;
  await resource.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'DELETE',
    category: 'RESOURCE',
    details: {
      resourceId: req.params.id,
      title: resource.title
    }
  });

  res.status(200).json({
    success: true,
    message: 'Resource deleted'
  });
});

// @desc    Download resource (increment counter)
// @route   GET /api/resources/:id/download
// @access  Private
const downloadResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
    .populate('eventId', 'title organizers');

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Check access permission (same as getResourceById)
  let hasAccess = false;

  if (['Super Admin', 'Academic Admin', 'Non-Academic Admin'].includes(req.user.role)) {
    hasAccess = true;
  } else if (resource.visibility === 'Public') {
    hasAccess = true;
  } else if (resource.accessibleTo.includes(req.user._id)) {
    hasAccess = true;
  } else if (resource.uploadedBy.toString() === req.user._id.toString()) {
    hasAccess = true;
  } else if (resource.visibility === 'Registered Only') {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: resource.eventId._id
    });
    if (registration) hasAccess = true;
  } else if (resource.visibility === 'Attended Only') {
    const attendance = await Attendance.findOne({
      event: resource.eventId._id,
      'attendees.user': req.user._id,
      'attendees.status': 'Present'
    });
    if (attendance) hasAccess = true;
  }

  if (!hasAccess) {
    res.status(403);
    throw new Error('You do not have access to download this resource');
  }

  // Increment download counter using model method
  await resource.incrementDownloads();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'DOWNLOAD',
    category: 'RESOURCE',
    details: {
      resourceId: resource._id,
      title: resource.title
    }
  });

  res.status(200).json({
    success: true,
    message: 'Download recorded',
    data: {
      fileUrl: resource.fileUrl,
      fileName: resource.title,
      mimeType: resource.mimeType
    }
  });
});

// @desc    Rate resource
// @route   POST /api/resources/:id/rate
// @access  Private
const rateResource = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Check if user already rated
  const existingRatingIndex = resource.ratings.findIndex(
    r => r.user.toString() === req.user._id.toString()
  );

  if (existingRatingIndex >= 0) {
    // Update existing rating
    resource.ratings[existingRatingIndex].rating = rating;
    resource.ratings[existingRatingIndex].review = review;
  } else {
    // Add new rating
    resource.ratings.push({
      user: req.user._id,
      rating,
      review
    });
  }

  // Recalculate average rating using model method
  resource.calculateAverageRating();

  await resource.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'RATE',
    category: 'RESOURCE',
    details: {
      resourceId: resource._id,
      title: resource.title,
      rating
    }
  });

  res.status(200).json({
    success: true,
    message: 'Rating added successfully',
    data: {
      averageRating: resource.averageRating,
      totalRatings: resource.ratings.length
    }
  });
});

// @desc    Comment on resource
// @route   POST /api/resources/:id/comment
// @access  Private
const commentOnResource = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.comments.push({
    user: req.user._id,
    text
  });

  await resource.save();

  await resource.populate('comments.user', 'name');

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'COMMENT',
    category: 'RESOURCE',
    details: {
      resourceId: resource._id,
      title: resource.title
    }
  });

  res.status(200).json({
    success: true,
    message: 'Comment added successfully',
    data: resource.comments
  });
});

// @desc    Delete comment from resource
// @route   DELETE /api/resources/:id/comment/:commentId
// @access  Private (Comment owner, Admin)
const deleteComment = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  const comment = resource.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check permission
  if (
    comment.user.toString() !== req.user._id.toString() &&
    !['Super Admin', 'Academic Admin'].includes(req.user.role)
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  comment.deleteOne();
  await resource.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'DELETE_COMMENT',
    category: 'RESOURCE',
    details: {
      resourceId: resource._id,
      commentId: req.params.commentId
    }
  });

  res.status(200).json({
    success: true,
    message: 'Comment deleted'
  });
});

module.exports = {
  uploadResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  downloadResource,
  rateResource,
  commentOnResource,
  deleteComment
};
