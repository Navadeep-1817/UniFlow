const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const Department = require('../models/Department');
const Venue = require('../models/Venue');
const Trainer = require('../models/Trainer');
const asyncHandler = require('express-async-handler');

// @desc    Get HOD department events
// @route   GET /api/hod/events
// @access  Private (HOD only)
const getDepartmentEvents = asyncHandler(async (req, res) => {
  // Get HOD's department
  const hod = await User.findById(req.user._id).populate('department');
  
  if (!hod || !hod.department) {
    return res.status(400).json({
      success: false,
      message: 'Department not found for this HOD'
    });
  }

  const events = await Event.find({
    organizer: hod.department._id,
    organizerModel: 'Department'
  })
    .populate('venue', 'name building capacity')
    .populate('trainer', 'name email organization expertise')
    .populate('coordinators', 'firstName lastName email')
    .populate('targetAudience.departments', 'name code')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Create department event
// @route   POST /api/hod/events
// @access  Private (HOD only)
const createDepartmentEvent = asyncHandler(async (req, res) => {
  console.log('=== Create Event Request ===');
  console.log('User ID:', req.user._id);
  console.log('Request Body:', req.body);
  
  // Get HOD's department and university
  const hod = await User.findById(req.user._id).populate('department university');
  
  console.log('HOD Found:', !!hod);
  console.log('HOD Department:', hod?.department);
  console.log('HOD University:', hod?.university);
  
  if (!hod) {
    return res.status(400).json({
      success: false,
      message: 'HOD user not found'
    });
  }
  
  if (!hod.department) {
    return res.status(400).json({
      success: false,
      message: 'Department not found for this HOD. Please contact administrator to assign department.'
    });
  }
  
  if (!hod.university) {
    return res.status(400).json({
      success: false,
      message: 'University not found for this HOD. Please contact administrator.'
    });
  }

  // Create or get default venue for all events
  const universityId = hod.university._id || hod.university;
  
  console.log('Looking for venue with university:', universityId);
  
  let defaultVenue = await Venue.findOne({ 
    university: universityId,
    name: 'TBD - To Be Decided'
  });
  
  console.log('Default venue found:', !!defaultVenue);
  
  if (!defaultVenue) {
    console.log('Creating default venue...');
    try {
      defaultVenue = await Venue.create({
        name: 'TBD - To Be Decided',
        code: 'TBD-001',
        building: 'TBD',
        capacity: 100,
        university: universityId,
        type: 'Classroom',
        status: 'Active',
        floor: '1',
        facilities: ['Projector', 'Whiteboard']
      });
      console.log('Default venue created:', defaultVenue._id);
    } catch (venueError) {
      console.error('Error creating venue:', venueError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create default venue',
        error: venueError.message
      });
    }
  }
  const venueId = defaultVenue._id;

  // Create event data
  const departmentId = hod.department._id || hod.department;
  
  // Validate required fields
  if (!req.body.name && !req.body.title) {
    return res.status(400).json({
      success: false,
      message: 'Event name/title is required'
    });
  }
  
  if (!req.body.description) {
    return res.status(400).json({
      success: false,
      message: 'Event description is required'
    });
  }
  
  if (!req.body.startDate) {
    return res.status(400).json({
      success: false,
      message: 'Event start date is required'
    });
  }
  
  if (!req.body.endDate) {
    return res.status(400).json({
      success: false,
      message: 'Event end date is required'
    });
  }
  
  const eventData = {
    title: req.body.name || req.body.title,
    description: req.body.description,
    type: 'Academic', // Always Academic for HOD events
    subType: req.body.type || 'FDP',
    category: 'Internal',
    university: universityId,
    organizer: departmentId,
    organizerModel: 'Department',
    coordinators: [req.user._id],
    date: {
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    },
    time: {
      startTime: '09:00',
      endTime: '17:00'
    },
    venue: venueId,
    mode: 'Offline',
    targetAudience: {
      departments: [departmentId],
      years: [],
      isOpenForAll: false
    },
    registration: {
      isRequired: true,
      startDate: new Date(),
      endDate: new Date(req.body.startDate),
      maxParticipants: 100,
      currentParticipants: 0,
      fees: {
        amount: 0,
        currency: 'INR'
      }
    },
    status: 'Pending',
    budget: {
      estimated: 0
    },
    attendance: {
      isRequired: true,
      minimumPercentage: 75
    },
    certificate: {
      isProvided: false,
      criteria: {
        minimumAttendance: 75
      }
    },
    createdBy: req.user._id
  };
  
  console.log('Event Data to Create:', JSON.stringify(eventData, null, 2));

  try {
    const event = await Event.create(eventData);
    
    // Populate the created event
    await event.populate([
      { path: 'venue', select: 'name building capacity' },
      { path: 'trainer', select: 'name email organization' },
      { path: 'coordinators', select: 'firstName lastName email' },
      { path: 'targetAudience.departments', select: 'name code' }
    ]);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('=== Error Creating Event ===');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    if (error.errors) {
      console.error('Validation Errors:', error.errors);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event',
      errors: error.errors,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @desc    Update department event
// @route   PUT /api/hod/events/:id
// @access  Private (HOD only)
const updateDepartmentEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if event belongs to HOD's department
  const hod = await User.findById(req.user._id).populate('department');
  if (event.organizer.toString() !== hod.department._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this event'
    });
  }

  // Update event
  const updateData = {
    title: req.body.name || req.body.title || event.title,
    description: req.body.description || event.description,
    subType: req.body.type || event.subType,
    'date.startDate': req.body.startDate || event.date.startDate,
    'date.endDate': req.body.endDate || event.date.endDate,
    'time.startTime': req.body.startTime || event.time.startTime,
    'time.endTime': req.body.endTime || event.time.endTime,
    trainer: req.body.trainer !== undefined ? req.body.trainer : event.trainer,
    status: req.body.status || event.status,
    updatedBy: req.user._id
  };

  event = await Event.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  })
    .populate('venue', 'name building capacity')
    .populate('trainer', 'name email organization')
    .populate('coordinators', 'firstName lastName email');

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Delete department event
// @route   DELETE /api/hod/events/:id
// @access  Private (HOD only)
const deleteDepartmentEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if event belongs to HOD's department
  const hod = await User.findById(req.user._id).populate('department');
  if (event.organizer.toString() !== hod.department._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this event'
    });
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
});

// @desc    Get event participants
// @route   GET /api/hod/events/:id/participants
// @access  Private (HOD only)
const getEventParticipants = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  const registrations = await Registration.find({
    event: req.params.id,
    status: { $in: ['Registered', 'Attended'] }
  })
    .populate('user', 'firstName lastName email rollNumber department year')
    .populate({
      path: 'user',
      populate: {
        path: 'department',
        select: 'name code'
      }
    })
    .sort('-createdAt');

  // Get attendance statistics
  const totalRegistered = registrations.length;
  const attended = registrations.filter(r => r.status === 'Attended').length;
  const attendancePercentage = totalRegistered > 0 ? ((attended / totalRegistered) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    count: registrations.length,
    stats: {
      totalRegistered,
      attended,
      attendancePercentage
    },
    data: registrations
  });
});

// @desc    Get department faculty
// @route   GET /api/hod/faculty
// @access  Private (HOD only)
const getDepartmentFaculty = asyncHandler(async (req, res) => {
  // Get HOD's department
  const hod = await User.findById(req.user._id).populate('department');
  
  if (!hod || !hod.department) {
    return res.status(400).json({
      success: false,
      message: 'Department not found for this HOD'
    });
  }

  const faculty = await User.find({
    department: hod.department._id,
    role: 'faculty',
    isApproved: true
  })
    .select('firstName lastName email phone specialization qualification experience profilePicture')
    .sort('firstName');

  res.status(200).json({
    success: true,
    count: faculty.length,
    data: faculty
  });
});

// @desc    Get department students
// @route   GET /api/hod/students
// @access  Private (HOD only)
const getDepartmentStudents = asyncHandler(async (req, res) => {
  // Get HOD's department
  const hod = await User.findById(req.user._id).populate('department');
  
  if (!hod || !hod.department) {
    return res.status(400).json({
      success: false,
      message: 'Department not found for this HOD'
    });
  }

  const { year, section, search } = req.query;
  const query = {
    department: hod.department._id,
    role: 'student',
    isApproved: true
  };

  if (year) query.year = parseInt(year);
  if (section) query.section = section;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const students = await User.find(query)
    .select('firstName lastName email rollNumber year section cgpa profilePicture')
    .sort('rollNumber');

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// @desc    Allocate trainer to event
// @route   PUT /api/hod/events/:id/allocate-trainer
// @access  Private (HOD only)
const allocateTrainerToEvent = asyncHandler(async (req, res) => {
  const { trainerId } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if trainer exists and is verified
  if (trainerId) {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }
    if (!trainer.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Trainer is not verified yet. Please select a verified trainer.'
      });
    }
  }

  event.trainer = trainerId || null;
  event.updatedBy = req.user._id;
  await event.save();

  await event.populate('trainer', 'name email organization expertise');

  res.status(200).json({
    success: true,
    message: trainerId ? 'Trainer allocated successfully' : 'Trainer removed successfully',
    data: event
  });
});

// @desc    Get all verified trainers for allocation (department-specific)
// @route   GET /api/hod/trainers
// @access  Private (HOD only)
const getVerifiedTrainers = asyncHandler(async (req, res) => {
  // Get HOD's department
  const hod = await User.findById(req.user._id).populate('department');
  
  if (!hod || !hod.department) {
    return res.status(400).json({
      success: false,
      message: 'Department not found for this HOD'
    });
  }

  const { search, expertise } = req.query;

  const query = {
    isActive: true,
    isVerified: true,
    department: hod.department._id // Only trainers from HOD's department
  };

  // Optional search by name, email, or organization
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { organization: { $regex: search, $options: 'i' } }
    ];
  }

  // Optional filter by expertise domain
  if (expertise) {
    query['expertise.domain'] = { $regex: expertise, $options: 'i' };
  }

  const trainers = await Trainer.find(query)
    .select('name email phone organization designation experience expertise ratings eventsDelivered')
    .populate('university', 'name')
    .populate('department', 'name')
    .sort('-ratings.averageRating');

  res.status(200).json({
    success: true,
    count: trainers.length,
    data: trainers
  });
});

// @desc    Get HOD dashboard statistics
// @route   GET /api/hod/dashboard-stats
// @access  Private (HOD only)
const getDashboardStats = asyncHandler(async (req, res) => {
  const hod = await User.findById(req.user._id).populate('department');
  
  if (!hod || !hod.department) {
    return res.status(400).json({
      success: false,
      message: 'Department not found for this HOD'
    });
  }

  // Get counts
  const [totalFaculty, totalStudents, totalEvents, ongoingEvents, upcomingEvents] = await Promise.all([
    User.countDocuments({ department: hod.department._id, role: 'faculty', isApproved: true }),
    User.countDocuments({ department: hod.department._id, role: 'student', isApproved: true }),
    Event.countDocuments({ organizer: hod.department._id, organizerModel: 'Department' }),
    Event.countDocuments({ organizer: hod.department._id, organizerModel: 'Department', status: 'Ongoing' }),
    Event.countDocuments({ 
      organizer: hod.department._id, 
      organizerModel: 'Department', 
      status: { $in: ['Pending', 'Approved', 'Upcoming'] }
    })
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalFaculty,
      totalStudents,
      totalEvents,
      ongoingEvents,
      upcomingEvents
    }
  });
});

module.exports = {
  getDepartmentEvents,
  createDepartmentEvent,
  updateDepartmentEvent,
  deleteDepartmentEvent,
  getEventParticipants,
  getDepartmentFaculty,
  getDepartmentStudents,
  allocateTrainerToEvent,
  getVerifiedTrainers,
  getDashboardStats
};
