const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Mark attendance for a registration (simple toggle)
exports.markAttendance = async (req, res) => {
  try {
    const { registrationId, present } = req.body;

    const reg = await Registration.findById(registrationId);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

    reg.attended = !!present;
    reg.attendedAt = present ? new Date() : null;
    await reg.save();

    return res.status(200).json({ success: true, data: reg });
  } catch (error) {
    console.error('markAttendance error:', error);
    return res.status(500).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
};

// Get attendance summary for an event
exports.getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const totalRegistered = await Registration.countDocuments({ eventId, status: 'Registered' });
    const totalAttended = await Registration.countDocuments({ eventId, attended: true });

    const percentage = totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0;

    return res.status(200).json({
      success: true,
      data: {
        eventId,
        totalRegistered,
        totalAttended,
        attendancePercentage: Number(percentage.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('getEventAttendance error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
};


