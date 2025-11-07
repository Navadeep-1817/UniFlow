const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Submit feedback for an event
 * @route   POST /api/feedback
 * @access  Private (Student only)
 */
const submitFeedback = asyncHandler(async (req, res) => {
  const {
    eventId,
    ratings,
    questions,
    strengths,
    improvements,
    comments,
    wouldRecommend,
    isAnonymous,
  } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if event has ended
  if (new Date() < event.endDate) {
    res.status(400);
    throw new Error('Cannot submit feedback before event ends');
  }

  // Check if student is registered for the event
  const registration = await Registration.findOne({
    eventId,
    studentId: req.user._id,
    status: 'Approved',
  });

  if (!registration) {
    res.status(403);
    throw new Error('You must be registered for this event to submit feedback');
  }

  // Check if student has minimum attendance (optional requirement)
  const attendanceRecords = await Attendance.find({
    eventId,
    studentId: req.user._id,
    status: 'Present',
  });

  const attendancePercentage = (attendanceRecords.length / event.sessions.length) * 100;
  
  // Require at least 50% attendance to submit feedback
  if (attendancePercentage < 50) {
    res.status(400);
    throw new Error(`Minimum 50% attendance required to submit feedback. Your attendance: ${attendancePercentage.toFixed(2)}%`);
  }

  // Check if feedback already exists
  const existingFeedback = await Feedback.findOne({
    eventId,
    studentId: req.user._id,
  });

  if (existingFeedback) {
    res.status(400);
    throw new Error('You have already submitted feedback for this event');
  }

  // Validate overall rating
  if (!ratings || !ratings.overall || ratings.overall < 1 || ratings.overall > 5) {
    res.status(400);
    throw new Error('Overall rating is required and must be between 1 and 5');
  }

  // Create feedback
  const feedback = await Feedback.create({
    eventId,
    registrationId: registration._id,
    studentId: req.user._id,
    ratings,
    questions,
    strengths,
    improvements,
    comments,
    wouldRecommend,
    isAnonymous: isAnonymous || false,
  });

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Feedback Submitted',
    resource: 'Feedback',
    resourceId: feedback._id,
    details: `Feedback submitted for event: ${event.title}`,
  });

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: feedback,
  });
});

/**
 * @desc    Get all feedback with filters
 * @route   GET /api/feedback
 * @access  Private (Admins, Faculty)
 */
const getAllFeedback = asyncHandler(async (req, res) => {
  const {
    eventId,
    studentId,
    minRating,
    maxRating,
    wouldRecommend,
    isAnonymous,
    page = 1,
    limit = 20,
    sortBy = '-submittedAt',
  } = req.query;

  // Build query
  const query = {};

  if (eventId) query.eventId = eventId;
  if (studentId) query.studentId = studentId;
  if (minRating) query['ratings.overall'] = { $gte: parseFloat(minRating) };
  if (maxRating) query['ratings.overall'] = { ...query['ratings.overall'], $lte: parseFloat(maxRating) };
  if (wouldRecommend !== undefined) query.wouldRecommend = wouldRecommend === 'true';
  if (isAnonymous !== undefined) query.isAnonymous = isAnonymous === 'true';

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const feedback = await Feedback.find(query)
    .populate('eventId', 'title eventType startDate endDate')
    .populate('studentId', 'name email rollNumber')
    .populate('registrationId', 'registrationDate')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const total = await Feedback.countDocuments(query);

  res.status(200).json({
    success: true,
    count: feedback.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: feedback,
  });
});

/**
 * @desc    Get feedback for a specific event
 * @route   GET /api/feedback/event/:eventId
 * @access  Private (All authenticated users)
 */
const getFeedbackForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { page = 1, limit = 20, sortBy = '-ratings.overall' } = req.query;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Build query
  const query = { eventId };

  // If user is a student, only show anonymous feedback or their own
  if (req.user.role === 'Student') {
    query.$or = [
      { isAnonymous: true },
      { studentId: req.user._id },
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const feedback = await Feedback.find(query)
    .populate({
      path: 'studentId',
      select: 'name email rollNumber',
      match: { isAnonymous: false }, // Don't populate student details for anonymous feedback
    })
    .populate('registrationId', 'registrationDate')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const total = await Feedback.countDocuments(query);

  res.status(200).json({
    success: true,
    count: feedback.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: feedback,
  });
});

/**
 * @desc    Get my feedback submissions
 * @route   GET /api/feedback/my-feedback
 * @access  Private (Student only)
 */
const getMyFeedback = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortBy = '-submittedAt' } = req.query;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const feedback = await Feedback.find({ studentId: req.user._id })
    .populate('eventId', 'title eventType startDate endDate')
    .populate('registrationId', 'registrationDate')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const total = await Feedback.countDocuments({ studentId: req.user._id });

  res.status(200).json({
    success: true,
    count: feedback.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: feedback,
  });
});

/**
 * @desc    Update feedback
 * @route   PUT /api/feedback/:id
 * @access  Private (Student - only their own)
 */
const updateFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    ratings,
    questions,
    strengths,
    improvements,
    comments,
    wouldRecommend,
  } = req.body;

  // Find feedback
  const feedback = await Feedback.findById(id);

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  // Check ownership
  if (feedback.studentId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this feedback');
  }

  // Check if event is still open for feedback updates (e.g., 7 days after event end)
  const event = await Event.findById(feedback.eventId);
  const daysSinceEventEnd = Math.floor((new Date() - event.endDate) / (1000 * 60 * 60 * 24));

  if (daysSinceEventEnd > 7) {
    res.status(400);
    throw new Error('Feedback can only be updated within 7 days after event ends');
  }

  // Update fields
  if (ratings) {
    if (ratings.overall && (ratings.overall < 1 || ratings.overall > 5)) {
      res.status(400);
      throw new Error('Overall rating must be between 1 and 5');
    }
    feedback.ratings = { ...feedback.ratings, ...ratings };
  }
  if (questions) feedback.questions = questions;
  if (strengths !== undefined) feedback.strengths = strengths;
  if (improvements !== undefined) feedback.improvements = improvements;
  if (comments !== undefined) feedback.comments = comments;
  if (wouldRecommend !== undefined) feedback.wouldRecommend = wouldRecommend;

  await feedback.save();

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Feedback Updated',
    resource: 'Feedback',
    resourceId: feedback._id,
    details: `Feedback updated for event: ${event.title}`,
  });

  res.status(200).json({
    success: true,
    message: 'Feedback updated successfully',
    data: feedback,
  });
});

/**
 * @desc    Delete feedback
 * @route   DELETE /api/feedback/:id
 * @access  Private (Student - their own, Super Admin)
 */
const deleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find feedback
  const feedback = await Feedback.findById(id);

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  // Check authorization
  if (
    req.user.role !== 'Super Admin' &&
    feedback.studentId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this feedback');
  }

  // Get event details for audit log
  const event = await Event.findById(feedback.eventId);

  await feedback.deleteOne();

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Feedback Deleted',
    resource: 'Feedback',
    resourceId: feedback._id,
    details: `Feedback deleted for event: ${event ? event.title : 'Unknown Event'}`,
  });

  res.status(200).json({
    success: true,
    message: 'Feedback deleted successfully',
  });
});

/**
 * @desc    Get feedback statistics for an event
 * @route   GET /api/feedback/stats/:eventId
 * @access  Private (Admins, Faculty)
 */
const getFeedbackStats = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Get all feedback for the event
  const allFeedback = await Feedback.find({ eventId });

  if (allFeedback.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No feedback submitted yet for this event',
      data: {
        totalFeedback: 0,
        averageRatings: null,
        ratingDistribution: null,
        recommendationRate: null,
      },
    });
  }

  // Calculate average ratings
  const averageRatings = {
    overall: 0,
    content: 0,
    trainer: 0,
    venue: 0,
    organization: 0,
    materials: 0,
  };

  let contentCount = 0,
    trainerCount = 0,
    venueCount = 0,
    organizationCount = 0,
    materialsCount = 0;

  allFeedback.forEach((feedback) => {
    averageRatings.overall += feedback.ratings.overall;
    if (feedback.ratings.content) {
      averageRatings.content += feedback.ratings.content;
      contentCount++;
    }
    if (feedback.ratings.trainer) {
      averageRatings.trainer += feedback.ratings.trainer;
      trainerCount++;
    }
    if (feedback.ratings.venue) {
      averageRatings.venue += feedback.ratings.venue;
      venueCount++;
    }
    if (feedback.ratings.organization) {
      averageRatings.organization += feedback.ratings.organization;
      organizationCount++;
    }
    if (feedback.ratings.materials) {
      averageRatings.materials += feedback.ratings.materials;
      materialsCount++;
    }
  });

  averageRatings.overall = (averageRatings.overall / allFeedback.length).toFixed(2);
  averageRatings.content = contentCount > 0 ? (averageRatings.content / contentCount).toFixed(2) : 'N/A';
  averageRatings.trainer = trainerCount > 0 ? (averageRatings.trainer / trainerCount).toFixed(2) : 'N/A';
  averageRatings.venue = venueCount > 0 ? (averageRatings.venue / venueCount).toFixed(2) : 'N/A';
  averageRatings.organization = organizationCount > 0 ? (averageRatings.organization / organizationCount).toFixed(2) : 'N/A';
  averageRatings.materials = materialsCount > 0 ? (averageRatings.materials / materialsCount).toFixed(2) : 'N/A';

  // Calculate rating distribution (1-5 stars)
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allFeedback.forEach((feedback) => {
    const rating = Math.round(feedback.ratings.overall);
    ratingDistribution[rating]++;
  });

  // Calculate recommendation rate
  const recommendCount = allFeedback.filter((f) => f.wouldRecommend === true).length;
  const recommendationRate = ((recommendCount / allFeedback.length) * 100).toFixed(2);

  // Get total registrations for response rate
  const totalRegistrations = await Registration.countDocuments({
    eventId,
    status: 'Approved',
  });
  const responseRate = ((allFeedback.length / totalRegistrations) * 100).toFixed(2);

  // Compile common strengths and improvements
  const strengths = allFeedback
    .filter((f) => f.strengths)
    .map((f) => f.strengths);
  const improvements = allFeedback
    .filter((f) => f.improvements)
    .map((f) => f.improvements);

  res.status(200).json({
    success: true,
    data: {
      eventTitle: event.title,
      totalFeedback: allFeedback.length,
      totalRegistrations,
      responseRate: `${responseRate}%`,
      averageRatings,
      ratingDistribution,
      recommendationRate: `${recommendationRate}%`,
      wouldRecommendCount: recommendCount,
      strengths: strengths.slice(0, 10), // Top 10
      improvements: improvements.slice(0, 10), // Top 10
      anonymousFeedbackCount: allFeedback.filter((f) => f.isAnonymous).length,
    },
  });
});

/**
 * @desc    Export feedback data for an event (CSV format)
 * @route   GET /api/feedback/export/:eventId
 * @access  Private (Admins only)
 */
const exportFeedback = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Get all feedback
  const allFeedback = await Feedback.find({ eventId })
    .populate('studentId', 'name email rollNumber')
    .populate('registrationId', 'registrationDate')
    .sort('-submittedAt');

  if (allFeedback.length === 0) {
    res.status(404);
    throw new Error('No feedback data available for export');
  }

  // Format data for CSV
  const csvData = allFeedback.map((feedback) => ({
    'Event Title': event.title,
    'Student Name': feedback.isAnonymous ? 'Anonymous' : feedback.studentId?.name || 'N/A',
    'Student Email': feedback.isAnonymous ? 'Anonymous' : feedback.studentId?.email || 'N/A',
    'Roll Number': feedback.isAnonymous ? 'Anonymous' : feedback.studentId?.rollNumber || 'N/A',
    'Overall Rating': feedback.ratings.overall,
    'Content Rating': feedback.ratings.content || 'N/A',
    'Trainer Rating': feedback.ratings.trainer || 'N/A',
    'Venue Rating': feedback.ratings.venue || 'N/A',
    'Organization Rating': feedback.ratings.organization || 'N/A',
    'Materials Rating': feedback.ratings.materials || 'N/A',
    'Would Recommend': feedback.wouldRecommend ? 'Yes' : 'No',
    'Strengths': feedback.strengths || '',
    'Improvements': feedback.improvements || '',
    'Comments': feedback.comments || '',
    'Submitted At': feedback.submittedAt.toISOString(),
  }));

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Feedback Exported',
    resource: 'Feedback',
    resourceId: eventId,
    details: `Feedback data exported for event: ${event.title}`,
  });

  res.status(200).json({
    success: true,
    message: 'Feedback data ready for export',
    count: csvData.length,
    data: csvData,
  });
});

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackForEvent,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  exportFeedback,
};
