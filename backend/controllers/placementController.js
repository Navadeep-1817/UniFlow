const PlacementDrive = require('../models/PlacementDrive');
const Event = require('../models/Event');
const Student = require('../models/Student');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('express-async-handler');

// @desc    Create new placement drive
// @route   POST /api/placements
// @access  Private (Admin, Placement Cell)
const createPlacementDrive = asyncHandler(async (req, res) => {
  const {
    eventId,
    company,
    jobDetails,
    package: packageDetails,
    eligibility,
    rounds,
    importantDates,
    contactPerson,
    documents
  } = req.body;

  // Validate event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check for duplicate placement drive for this event
  const existingDrive = await PlacementDrive.findOne({ eventId });
  if (existingDrive) {
    res.status(400);
    throw new Error('Placement drive already exists for this event');
  }

  // Validate departments in eligibility
  if (eligibility?.departments && eligibility.departments.length > 0) {
    const depts = await Department.find({ _id: { $in: eligibility.departments } });
    if (depts.length !== eligibility.departments.length) {
      res.status(400);
      throw new Error('One or more departments not found');
    }
  }

  const placementDrive = await PlacementDrive.create({
    eventId,
    company,
    jobDetails,
    package: packageDetails,
    eligibility,
    rounds,
    importantDates,
    contactPerson,
    documents,
    createdBy: req.user._id
  });

  await placementDrive.populate([
    { path: 'eventId', select: 'title description startDate endDate' },
    { path: 'eligibility.departments', select: 'name code' }
  ]);

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'CREATE',
    category: 'PLACEMENT',
    details: {
      placementId: placementDrive._id,
      company: company.name,
      eventId
    }
  });

  res.status(201).json({
    success: true,
    data: placementDrive
  });
});

// @desc    Get all placement drives
// @route   GET /api/placements
// @access  Public (with filters for students)
const getAllPlacementDrives = asyncHandler(async (req, res) => {
  const {
    status,
    jobType,
    workMode,
    industry,
    minCTC,
    maxCTC,
    department,
    search,
    sortBy = '-importantDates.applicationDeadline',
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  // Status filter
  if (status) {
    query.status = status;
  }

  // Job type filter
  if (jobType) {
    query['jobDetails.type'] = jobType;
  }

  // Work mode filter
  if (workMode) {
    query['jobDetails.workMode'] = workMode;
  }

  // Industry filter
  if (industry) {
    query['company.industry'] = new RegExp(industry, 'i');
  }

  // CTC range filter
  if (minCTC || maxCTC) {
    query['package.ctc'] = {};
    if (minCTC) query['package.ctc'].$gte = Number(minCTC);
    if (maxCTC) query['package.ctc'].$lte = Number(maxCTC);
  }

  // Department filter
  if (department) {
    query['eligibility.departments'] = department;
  }

  // Search filter
  if (search) {
    query.$or = [
      { 'company.name': new RegExp(search, 'i') },
      { 'jobDetails.role': new RegExp(search, 'i') },
      { 'jobDetails.description': new RegExp(search, 'i') }
    ];
  }

  // If student, filter by eligibility
  if (req.user && req.user.role === 'Student') {
    const student = await Student.findOne({ user: req.user._id });
    if (student) {
      query['eligibility.departments'] = student.department;
      query['eligibility.minCGPA'] = { $lte: student.cgpa || 10 };
      query['eligibility.maxBacklogs'] = { $gte: student.backlogs || 0 };
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const placementDrives = await PlacementDrive.find(query)
    .populate('eventId', 'title description startDate endDate venue')
    .populate('eligibility.departments', 'name code')
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  const total = await PlacementDrive.countDocuments(query);

  res.status(200).json({
    success: true,
    count: placementDrives.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: placementDrives
  });
});

// @desc    Get single placement drive
// @route   GET /api/placements/:id
// @access  Public
const getPlacementDriveById = asyncHandler(async (req, res) => {
  const placementDrive = await PlacementDrive.findById(req.params.id)
    .populate('eventId', 'title description startDate endDate venue')
    .populate('eligibility.departments', 'name code')
    .populate('rounds.selectedStudents', 'user rollNumber')
    .populate('results.applied.students', 'user rollNumber')
    .populate('results.shortlisted.students', 'user rollNumber')
    .populate('results.selected.students', 'user rollNumber offers')
    .populate('results.rejected.students', 'user rollNumber');

  if (!placementDrive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  res.status(200).json({
    success: true,
    data: placementDrive
  });
});

// @desc    Update placement drive
// @route   PUT /api/placements/:id
// @access  Private (Admin, Placement Cell)
const updatePlacementDrive = asyncHandler(async (req, res) => {
  let placementDrive = await PlacementDrive.findById(req.params.id);

  if (!placementDrive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  const {
    company,
    jobDetails,
    package: packageDetails,
    eligibility,
    rounds,
    importantDates,
    contactPerson,
    documents,
    status
  } = req.body;

  // Validate departments if updated
  if (eligibility?.departments) {
    const depts = await Department.find({ _id: { $in: eligibility.departments } });
    if (depts.length !== eligibility.departments.length) {
      res.status(400);
      throw new Error('One or more departments not found');
    }
  }

  placementDrive = await PlacementDrive.findByIdAndUpdate(
    req.params.id,
    {
      company,
      jobDetails,
      package: packageDetails,
      eligibility,
      rounds,
      importantDates,
      contactPerson,
      documents,
      status
    },
    { new: true, runValidators: true }
  );

  await placementDrive.populate([
    { path: 'eventId', select: 'title description startDate endDate' },
    { path: 'eligibility.departments', select: 'name code' }
  ]);

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'UPDATE',
    category: 'PLACEMENT',
    details: {
      placementId: placementDrive._id,
      company: placementDrive.company.name
    }
  });

  res.status(200).json({
    success: true,
    data: placementDrive
  });
});

// @desc    Delete placement drive
// @route   DELETE /api/placements/:id
// @access  Private (Admin, Placement Cell)
const deletePlacementDrive = asyncHandler(async (req, res) => {
  const placementDrive = await PlacementDrive.findById(req.params.id);

  if (!placementDrive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  // Check if any students have already applied
  if (placementDrive.results.applied.students.length > 0) {
    res.status(400);
    throw new Error('Cannot delete placement drive with applications. Archive it instead.');
  }

  await placementDrive.deleteOne();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'DELETE',
    category: 'PLACEMENT',
    details: {
      placementId: req.params.id,
      company: placementDrive.company.name
    }
  });

  res.status(200).json({
    success: true,
    message: 'Placement drive deleted'
  });
});

// @desc    Register student for placement drive
// @route   POST /api/placements/:id/register
// @access  Private (Student)
const registerForPlacement = asyncHandler(async (req, res) => {
  const placementDrive = await PlacementDrive.findById(req.params.id)
    .populate('eligibility.departments');

  if (!placementDrive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  // Check if registration is open
  if (placementDrive.status !== 'Active') {
    res.status(400);
    throw new Error('Registration is not open for this placement drive');
  }

  // Check application deadline
  if (new Date() > placementDrive.importantDates.applicationDeadline) {
    res.status(400);
    throw new Error('Application deadline has passed');
  }

  // Get student details
  const student = await Student.findOne({ user: req.user._id }).populate('department');
  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  // Check eligibility - departments
  const eligibleDepts = placementDrive.eligibility.departments.map(d => d._id.toString());
  if (!eligibleDepts.includes(student.department._id.toString())) {
    res.status(403);
    throw new Error('Your department is not eligible for this placement drive');
  }

  // Check eligibility - CGPA
  if (student.cgpa < placementDrive.eligibility.minCGPA) {
    res.status(403);
    throw new Error(`Minimum CGPA required: ${placementDrive.eligibility.minCGPA}`);
  }

  // Check eligibility - backlogs
  if (student.backlogs > placementDrive.eligibility.maxBacklogs) {
    res.status(403);
    throw new Error(`Maximum backlogs allowed: ${placementDrive.eligibility.maxBacklogs}`);
  }

  // Check if already registered
  if (placementDrive.results.applied.students.includes(student._id)) {
    res.status(400);
    throw new Error('You have already registered for this placement drive');
  }

  // Register student
  placementDrive.results.applied.students.push(student._id);
  placementDrive.results.applied.count = placementDrive.results.applied.students.length;
  await placementDrive.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'REGISTER',
    category: 'PLACEMENT',
    details: {
      placementId: placementDrive._id,
      company: placementDrive.company.name,
      studentId: student._id
    }
  });

  res.status(200).json({
    success: true,
    message: 'Successfully registered for placement drive',
    data: placementDrive
  });
});

// @desc    Update application status (shortlist, select, reject)
// @route   PUT /api/placements/:id/applications/:studentId
// @access  Private (Admin, Placement Cell)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, roundNumber, remarks } = req.body;

  if (!['shortlisted', 'selected', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be shortlisted, selected, or rejected');
  }

  const placementDrive = await PlacementDrive.findById(req.params.id);
  if (!placementDrive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Check if student applied
  if (!placementDrive.results.applied.students.includes(student._id)) {
    res.status(400);
    throw new Error('Student has not applied for this placement drive');
  }

  // Remove from all result categories first
  ['shortlisted', 'selected', 'rejected'].forEach(cat => {
    placementDrive.results[cat].students = placementDrive.results[cat].students.filter(
      s => s.toString() !== student._id.toString()
    );
  });

  // Add to new category
  placementDrive.results[status].students.push(student._id);
  placementDrive.results[status].count = placementDrive.results[status].students.length;

  // Update round details if provided
  if (roundNumber && placementDrive.rounds[roundNumber - 1]) {
    if (status === 'shortlisted' || status === 'selected') {
      if (!placementDrive.rounds[roundNumber - 1].selectedStudents.includes(student._id)) {
        placementDrive.rounds[roundNumber - 1].selectedStudents.push(student._id);
      }
    }
  }

  await placementDrive.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'UPDATE_STATUS',
    category: 'PLACEMENT',
    details: {
      placementId: placementDrive._id,
      company: placementDrive.company.name,
      studentId: student._id,
      status,
      roundNumber,
      remarks
    }
  });

  res.status(200).json({
    success: true,
    message: `Student ${status} successfully`,
    data: placementDrive
  });
});

// @desc    Record placement round results
// @route   POST /api/placements/:id/rounds
// @access  Private (Admin, Placement Cell)
const recordRound = asyncHandler(async (req, res) => {
  const { roundType, roundNumber, venue, date, selectedStudents, remarks } = req.body;

  const placementDrive = await PlacementDrive.findById(req.params.id);
  if (!placementDrive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  // Validate students
  if (selectedStudents && selectedStudents.length > 0) {
    const students = await Student.find({ _id: { $in: selectedStudents } });
    if (students.length !== selectedStudents.length) {
      res.status(400);
      throw new Error('One or more students not found');
    }
  }

  // Add or update round
  const roundIndex = placementDrive.rounds.findIndex(r => r.roundNumber === roundNumber);
  
  if (roundIndex >= 0) {
    // Update existing round
    placementDrive.rounds[roundIndex] = {
      roundType,
      roundNumber,
      venue,
      date,
      selectedStudents: selectedStudents || [],
      remarks
    };
  } else {
    // Add new round
    placementDrive.rounds.push({
      roundType,
      roundNumber,
      venue,
      date,
      selectedStudents: selectedStudents || [],
      remarks
    });
  }

  await placementDrive.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'RECORD_ROUND',
    category: 'PLACEMENT',
    details: {
      placementId: placementDrive._id,
      company: placementDrive.company.name,
      roundType,
      roundNumber,
      selectedCount: selectedStudents?.length || 0
    }
  });

  res.status(200).json({
    success: true,
    message: 'Round recorded successfully',
    data: placementDrive
  });
});

// @desc    Record placement offer
// @route   POST /api/placements/:id/offers/:studentId
// @access  Private (Admin, Placement Cell)
const recordOffer = asyncHandler(async (req, res) => {
  const { ctc, designation, joiningDate, location, offerStatus, remarks } = req.body;

  const placementDrive = await PlacementDrive.findById(req.params.id);
  if (!placementDrive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Check if student is selected
  if (!placementDrive.results.selected.students.includes(student._id)) {
    res.status(400);
    throw new Error('Student must be selected before recording offer');
  }

  // Check if offer already exists
  const existingOfferIndex = placementDrive.results.selected.offers.findIndex(
    o => o.student.toString() === student._id.toString()
  );

  const offerData = {
    student: student._id,
    ctc,
    designation,
    joiningDate,
    location,
    offerStatus: offerStatus || 'Offered',
    remarks
  };

  if (existingOfferIndex >= 0) {
    // Update existing offer
    placementDrive.results.selected.offers[existingOfferIndex] = offerData;
  } else {
    // Add new offer
    placementDrive.results.selected.offers.push(offerData);
  }

  await placementDrive.save();

  // Audit log
  await AuditLog.create({
    user: req.user._id,
    action: 'RECORD_OFFER',
    category: 'PLACEMENT',
    details: {
      placementId: placementDrive._id,
      company: placementDrive.company.name,
      studentId: student._id,
      ctc,
      designation,
      offerStatus
    }
  });

  res.status(200).json({
    success: true,
    message: 'Offer recorded successfully',
    data: placementDrive
  });
});

// @desc    Get placement statistics
// @route   GET /api/placements/stats
// @access  Private (Admin, Placement Cell)
const getPlacementStats = asyncHandler(async (req, res) => {
  const { academicYear, department } = req.query;

  const matchQuery = {};
  if (academicYear) matchQuery['importantDates.academicYear'] = academicYear;
  if (department) matchQuery['eligibility.departments'] = department;

  const stats = await PlacementDrive.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalDrives: { $sum: 1 },
        totalApplications: { $sum: '$results.applied.count' },
        totalShortlisted: { $sum: '$results.shortlisted.count' },
        totalSelected: { $sum: '$results.selected.count' },
        totalRejected: { $sum: '$results.rejected.count' },
        avgCTC: { $avg: '$package.ctc' },
        maxCTC: { $max: '$package.ctc' },
        minCTC: { $min: '$package.ctc' }
      }
    }
  ]);

  // Get offers statistics
  const offerStats = await PlacementDrive.aggregate([
    { $match: matchQuery },
    { $unwind: '$results.selected.offers' },
    {
      $group: {
        _id: '$results.selected.offers.offerStatus',
        count: { $sum: 1 },
        avgCTC: { $avg: '$results.selected.offers.ctc' }
      }
    }
  ]);

  // Get company-wise statistics
  const companyStats = await PlacementDrive.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$company.name',
        drives: { $sum: 1 },
        selected: { $sum: '$results.selected.count' },
        avgCTC: { $avg: '$package.ctc' }
      }
    },
    { $sort: { selected: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overall: stats[0] || {},
      offersByStatus: offerStats,
      topCompanies: companyStats
    }
  });
});

// @desc    Get student's placement history
// @route   GET /api/placements/my-placements
// @access  Private (Student)
const getStudentPlacements = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  const placements = await PlacementDrive.find({
    $or: [
      { 'results.applied.students': student._id },
      { 'results.shortlisted.students': student._id },
      { 'results.selected.students': student._id },
      { 'results.rejected.students': student._id }
    ]
  })
    .populate('eventId', 'title startDate endDate')
    .select('company jobDetails package status results importantDates')
    .sort('-importantDates.applicationDeadline');

  // Determine status for each placement
  const placementsWithStatus = placements.map(p => {
    let studentStatus = 'Unknown';
    if (p.results.selected.students.includes(student._id)) {
      studentStatus = 'Selected';
      // Check for offer
      const offer = p.results.selected.offers.find(
        o => o.student.toString() === student._id.toString()
      );
      if (offer) {
        studentStatus = `Selected - ${offer.offerStatus}`;
      }
    } else if (p.results.rejected.students.includes(student._id)) {
      studentStatus = 'Rejected';
    } else if (p.results.shortlisted.students.includes(student._id)) {
      studentStatus = 'Shortlisted';
    } else if (p.results.applied.students.includes(student._id)) {
      studentStatus = 'Applied';
    }

    return {
      ...p.toObject(),
      studentStatus
    };
  });

  res.status(200).json({
    success: true,
    count: placementsWithStatus.length,
    data: placementsWithStatus
  });
});

module.exports = {
  createPlacementDrive,
  getAllPlacementDrives,
  getPlacementDriveById,
  updatePlacementDrive,
  deletePlacementDrive,
  registerForPlacement,
  updateApplicationStatus,
  recordRound,
  recordOffer,
  getPlacementStats,
  getStudentPlacements
};
