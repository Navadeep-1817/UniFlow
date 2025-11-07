const Trainer = require('../models/Trainer');

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
