const Trainer = require('../models/Trainer');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// ==================== TRAINER AUTH ROUTES ====================

/**
 * @desc    Register new trainer
 * @route   POST /api/trainer/register
 * @access  Public
 */
exports.registerTrainer = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    type,
    university,
    department,
    organization,
    designation,
    qualification,
    experience,
    expertise,
    specialization,
    bio,
  } = req.body;

  // Check if trainer already exists
  const trainerExists = await Trainer.findOne({ email });

  if (trainerExists) {
    return res.status(400).json({
      success: false,
      message: 'Trainer already registered with this email',
    });
  }

  // Create trainer
  const trainer = await Trainer.create({
    name,
    email,
    password,
    phone,
    type: type || 'External',
    university: type === 'Internal' ? university : undefined,
    department: type === 'Internal' ? department : undefined,
    organization,
    designation,
    qualification,
    experience,
    expertise,
    specialization,
    bio,
    isActive: true,
    isVerified: false, // Requires verification by admin
  });

  if (trainer) {
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please wait for admin verification.',
      data: {
        _id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        type: trainer.type,
        isVerified: trainer.isVerified,
        token: generateToken(trainer._id),
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid trainer data',
    });
  }
});

/**
 * @desc    Login trainer
 * @route   POST /api/trainer/login
 * @access  Public
 */
exports.loginTrainer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Check for trainer
  const trainer = await Trainer.findOne({ email })
    .select('+password')
    .populate('university', 'name code')
    .populate('department', 'name code');

  if (!trainer) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if password matches
  const isMatch = await trainer.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if trainer is active
  if (!trainer.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated. Please contact admin.',
    });
  }

  // Update last login
  trainer.lastLogin = Date.now();
  await trainer.save();

  res.status(200).json({
    success: true,
    data: {
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      type: trainer.type,
      university: trainer.university,
      department: trainer.department,
      isVerified: trainer.isVerified,
      token: generateToken(trainer._id),
    },
  });
});

/**
 * @desc    Get current trainer profile
 * @route   GET /api/trainer/profile
 * @access  Private (Trainer)
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.trainer._id)
    .populate('university', 'name code')
    .populate('department', 'name code');

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  res.status(200).json({
    success: true,
    data: trainer,
  });
});

/**
 * @desc    Update trainer profile
 * @route   PUT /api/trainer/profile
 * @access  Private (Trainer)
 */
exports.updateTrainerProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone,
    alternatePhone: req.body.alternatePhone,
    organization: req.body.organization,
    designation: req.body.designation,
    qualification: req.body.qualification,
    experience: req.body.experience,
    expertise: req.body.expertise,
    specialization: req.body.specialization,
    bio: req.body.bio,
    photo: req.body.photo,
    socialLinks: req.body.socialLinks,
    address: req.body.address,
    charges: req.body.charges,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const trainer = await Trainer.findByIdAndUpdate(
    req.trainer._id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('university', 'name code')
    .populate('department', 'name code');

  res.status(200).json({
    success: true,
    data: trainer,
  });
});

/**
 * @desc    Get trainer's assigned events
 * @route   GET /api/trainer/events
 * @access  Private (Trainer)
 */
exports.getAssignedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    trainer: req.trainer._id,
  })
    .populate('venue', 'name building capacity')
    .populate('coordinators', 'name email')
    .populate('organizer')
    .populate('targetAudience.departments', 'name code')
    .sort('-date.startDate');

  // Categorize events
  const now = new Date();
  const categorized = {
    upcoming: [],
    ongoing: [],
    completed: [],
  };

  events.forEach((event) => {
    const startDate = new Date(event.date.startDate);
    const endDate = new Date(event.date.endDate);

    if (now < startDate) {
      categorized.upcoming.push(event);
    } else if (now >= startDate && now <= endDate) {
      categorized.ongoing.push(event);
    } else {
      categorized.completed.push(event);
    }
  });

  res.status(200).json({
    success: true,
    count: events.length,
    data: categorized,
    allEvents: events,
  });
});

/**
 * @desc    Get trainer's schedule/calendar
 * @route   GET /api/trainer/schedule
 * @access  Private (Trainer)
 */
exports.getSchedule = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const currentDate = new Date();
  const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
  const targetYear = year ? parseInt(year) : currentDate.getFullYear();

  const startDate = new Date(targetYear, targetMonth, 1);
  const endDate = new Date(targetYear, targetMonth + 1, 0);

  const events = await Event.find({
    trainer: req.trainer._id,
    'date.startDate': { $lte: endDate },
    'date.endDate': { $gte: startDate },
  })
    .populate('venue', 'name building')
    .populate('organizer')
    .select('title date time venue organizer status')
    .sort('date.startDate');

  res.status(200).json({
    success: true,
    count: events.length,
    month: targetMonth + 1,
    year: targetYear,
    data: events,
  });
});

/**
 * @desc    Update trainer availability
 * @route   PUT /api/trainer/availability
 * @access  Private (Trainer)
 */
exports.updateAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;

  const trainer = await Trainer.findByIdAndUpdate(
    req.trainer._id,
    { availability },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: trainer.availability,
  });
});

/**
 * @desc    Get trainer statistics
 * @route   GET /api/trainer/statistics
 * @access  Private (Trainer)
 */
exports.getStatistics = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.trainer._id);

  const [totalEvents, upcomingEvents, ongoingEvents, completedEvents] =
    await Promise.all([
      Event.countDocuments({ trainer: req.trainer._id }),
      Event.countDocuments({
        trainer: req.trainer._id,
        'date.startDate': { $gt: new Date() },
      }),
      Event.countDocuments({
        trainer: req.trainer._id,
        'date.startDate': { $lte: new Date() },
        'date.endDate': { $gte: new Date() },
      }),
      Event.countDocuments({
        trainer: req.trainer._id,
        'date.endDate': { $lt: new Date() },
      }),
    ]);

  res.status(200).json({
    success: true,
    data: {
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      eventsDelivered: trainer.eventsDelivered,
      averageRating: trainer.ratings.averageRating,
      totalRatings: trainer.ratings.totalRatings,
      isVerified: trainer.isVerified,
    },
  });
});

/**
 * @desc    Update trainer password
 * @route   PUT /api/trainer/update-password
 * @access  Private (Trainer)
 */
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current password and new password',
    });
  }

  const trainer = await Trainer.findById(req.trainer._id).select('+password');

  // Check current password
  const isMatch = await trainer.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  trainer.password = newPassword;
  trainer.passwordChangedAt = Date.now();
  await trainer.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    token: generateToken(trainer._id),
  });
});

// ==================== ADMIN TRAINER ROUTES ====================

/**
 * @desc    Create a new trainer
 * @route   POST /api/trainers
 * @access  Private
 */
exports.createTrainer = async (req, res) => {
  try {
    const trainerData = {
      ...req.body,
      createdBy: req.user._id,
      isVerified: req.user.role === 'superadmin' ? true : false,
    };

    const trainer = await Trainer.create(trainerData);

    res.status(201).json({
      success: true,
      message: 'Trainer created successfully',
      data: trainer,
    });
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trainer',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all trainers
 * @route   GET /api/trainers
 * @access  Private
 */
exports.getAllTrainers = async (req, res) => {
  try {
    const filter = {};
    // Optional: Filter by department/university for non-superadmins
    if (req.user.role !== 'superadmin') {
      filter.createdBy = req.user._id;
    }

    const trainers = await Trainer.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trainers',
      error: error.message,
    });
  }
};

/**
 * @desc    Get trainer by ID
 * @route   GET /api/trainers/:id
 * @access  Private
 */
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: 'Trainer not found' });
    }

    res.status(200).json({
      success: true,
      data: trainer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trainer',
      error: error.message,
    });
  }
};

/**
 * @desc    Update trainer
 * @route   PUT /api/trainers/:id
 * @access  Private
 */
exports.updateTrainer = async (req, res) => {
  try {
    let trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: 'Trainer not found' });
    }

    // Prevent unauthorized users from editing
    if (
      req.user.role !== 'superadmin' &&
      trainer.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this trainer',
      });
    }

    trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Trainer updated successfully',
      data: trainer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trainer',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete trainer
 * @route   DELETE /api/trainers/:id
 * @access  Private (Superadmin only)
 */
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: 'Trainer not found' });
    }

    await Trainer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Trainer deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting trainer',
      error: error.message,
    });
  }
};
