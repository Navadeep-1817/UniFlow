const User = require('../models/User');
const University = require('../models/University');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { ROLES } = require('../config/roles');

// GET /api/superadmin/pending-approvals
exports.getPendingApprovals = asyncHandler(async (req, res) => {
  // Exclude students from approval queue as they are auto-approved
  const pending = await User.find({ 
    isApproved: false,
    role: { $ne: 'student' } // Exclude students
  })
  .select('-password')
  .populate('university', 'name code')
  .populate('department', 'name code');
  
  res.status(200).json({ success: true, count: pending.length, data: pending });
});

// POST /api/superadmin/approve/:id
exports.approveUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid user id' });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.isApproved = true;
  user.approvedBy = req.user._id;
  user.approvedAt = new Date();
  await user.save();

  res.status(200).json({ success: true, message: 'User approved', data: user });
});

// POST /api/superadmin/reject/:id
exports.rejectUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid user id' });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  // Soft reject: deactivate account and mark not approved
  user.isApproved = false;
  user.isActive = false;
  await user.save();

  res.status(200).json({ success: true, message: 'User rejected', data: user });
});

// GET /api/superadmin/users
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, university, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (university) query.university = university;
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(query).select('-password').populate('university', 'name code').populate('department', 'name').skip(skip).limit(limitNum).sort('-createdAt');
  const total = await User.countDocuments(query);

  res.status(200).json({ success: true, count: users.length, total, page: pageNum, pages: Math.ceil(total / limitNum), data: users });
});

// GET /api/superadmin/stats
exports.getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const byRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  const byUniversity = await User.aggregate([
    { $group: { _id: '$university', count: { $sum: 1 } } },
    { $lookup: { from: 'universities', localField: '_id', foreignField: '_id', as: 'univ' } },
    { $unwind: { path: '$univ', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, universityId: '$_id', universityName: '$univ.name', universityCode: '$univ.code', count: 1 } }
  ]);

  res.status(200).json({ success: true, data: { totalUsers, byRole, byUniversity } });
});

// GET /api/superadmin/universities
exports.getUniversities = asyncHandler(async (req, res) => {
  const univs = await University.find({ isActive: true }).select('name code');
  res.status(200).json({ success: true, count: univs.length, data: univs });
});

// GET /api/superadmin/events
exports.getAllEvents = asyncHandler(async (req, res) => {
  const Event = require('../models/Event');
  
  const { startDate, endDate, type, subType, status, university } = req.query;
  const query = {};
  
  // Filter by date range if provided
  if (startDate || endDate) {
    if (startDate) query['date.startDate'] = { $gte: new Date(startDate) };
    if (endDate) query['date.endDate'] = { $lte: new Date(endDate) };
  }
  
  // Filter by event type (Academic/NonAcademic)
  if (type) query.type = type;
  
  // Filter by subType
  if (subType) query.subType = subType;
  
  // Filter by status
  if (status) query.status = status;
  
  // Filter by university
  if (university) query.university = university;
  
  const events = await Event.find(query)
    .select('title description date type subType venue mode status createdBy university organizer organizerModel registration eventCode')
    .populate('university', 'name code')
    .populate({
      path: 'organizer',
      select: 'name code'
    })
    .populate('venue', 'name location')
    .populate('createdBy', 'name email role')
    .sort({ 'date.startDate': 1 })
    .lean();
  
  res.status(200).json({ 
    success: true, 
    count: events.length, 
    data: events 
  });
});
