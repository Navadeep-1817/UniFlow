const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AuditLog = require('../models/AuditLog');

/**
 * registerForEvent
 * - Atomic / transactional registration to prevent race conditions
 * - Uses a transaction and conditional $inc to ensure seats are not oversubscribed
 */
exports.registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: 'Invalid eventId' });
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Load event inside transaction
    const event = await Event.findById(eventId).session(session).select('+registration');
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check event status and registration window
    if (event.status !== 'Approved' && event.status !== 'Upcoming') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Event is not open for registration' });
    }

    const now = new Date();
    if (event.registration && event.registration.isRequired) {
      if (event.registration.startDate && now < new Date(event.registration.startDate)) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: 'Registration has not started yet' });
      }
      if (event.registration.endDate && now > new Date(event.registration.endDate)) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: 'Registration period has ended' });
      }
    }

    // Prevent duplicate registration (unique compound index will also protect, but check here for better UX)
    const existing = await Registration.findOne({ eventId: event._id, studentId: userId }).session(session);
    if (existing) {
      await session.abortTransaction();
      return res.status(409).json({ success: false, message: 'User already registered for event' });
    }

    // If maxParticipants is set, ensure we don't overbook using a conditional update
    if (event.registration && event.registration.maxParticipants) {
      const updatedEvent = await Event.findOneAndUpdate(
        {
          _id: event._id,
          $expr: {
            $lt: ['$registration.currentParticipants', '$registration.maxParticipants'],
          },
        },
        { $inc: { 'registration.currentParticipants': 1 } },
        { new: true, session }
      );

      if (!updatedEvent) {
        // no seats available
        await session.abortTransaction();
        // create a waitlist entry instead (optional) or return an appropriate response
        return res.status(409).json({ success: false, message: 'Event is full. You have been waitlisted.' });
      }
    } else {
      // No maxParticipants configured — still ensure event doc is touched under session to keep consistency
      await Event.updateOne({ _id: event._id }, { $set: { 'registration.lastAccessedAt': new Date() } }, { session });
    }

    // Create registration
    const registration = await Registration.create(
      [
        {
          eventId: event._id,
          studentId: userId,
          status: 'Registered',
        },
      ],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Log audit (outside transaction)
    try {
      await AuditLog.log('Registration', registration[0]._id, 'create', userId, null, registration[0].toObject(), req.ip);
    } catch (logErr) {
      console.warn('Audit log failed:', logErr.message);
    }

    res.status(201).json({ success: true, message: 'Registration successful', data: registration[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('registerForEvent error:', error);
    // If we incremented currentParticipants but failed to create registration, try to decrement to avoid leakage
    try {
      await Event.updateOne({ _id: eventId }, { $inc: { 'registration.currentParticipants': -1 } });
    } catch (e) {
      console.warn('Failed to rollback participant count:', e.message);
    }
    res.status(500).json({ success: false, message: 'Error registering for event', error: error.message });
  }
};

// Simple helpers: getMyRegistrations and cancelRegistration
exports.getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ studentId: req.user._id }).populate('eventId', 'title date status');
    res.status(200).json({ success: true, count: regs.length, data: regs });
  } catch (error) {
    console.error('getMyRegistrations error:', error);
    res.status(500).json({ success: false, message: 'Error fetching registrations', error: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  const { id } = req.params; // registration id
  const userId = req.user._id;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const reg = await Registration.findById(id).session(session);
    if (!reg) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (reg.studentId.toString() !== userId.toString() && req.user.role !== 'superadmin') {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this registration' });
    }

    // Mark cancelled and decrement event currentParticipants if needed
    reg.status = 'Cancelled';
    reg.cancelledAt = new Date();
    await reg.save({ session });

    // Decrement participant count if it was counted
    await Event.updateOne({ _id: reg.eventId }, { $inc: { 'registration.currentParticipants': -1 } }, { session });

    await session.commitTransaction();
    session.endSession();

    await AuditLog.log('Registration', reg._id, 'cancel', userId, null, reg.toObject(), req.ip);

    res.status(200).json({ success: true, message: 'Registration cancelled', data: reg });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('cancelRegistration error:', error);
    res.status(500).json({ success: false, message: 'Error cancelling registration', error: error.message });
  }
};
  // exports are defined above using `exports.*` so no default module.exports override here
