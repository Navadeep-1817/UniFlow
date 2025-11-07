// const express = require('express');
// const { protect, authorize } = require('../middleware/authMiddleware');
// const {
//   createTrainer,
//   getAllTrainers,
//   getTrainerById,
//   updateTrainer,
//   deleteTrainer
// } = require('../controllers/trainerController');

// const router = express.Router();

// // Protect all routes (require login)
// router.use(protect);

// // Only admins/faculty can create trainers
// router.post('/', authorize('superadmin', 'academic_admin_hod', 'faculty'), createTrainer);

// router.get('/', getAllTrainers);
// router.get('/:id', getTrainerById);
// router.put('/:id', authorize('superadmin', 'academic_admin_hod', 'faculty'), updateTrainer);
// router.delete('/:id', authorize('superadmin'), deleteTrainer);

// module.exports = router;
const express = require('express');
const {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  // Trainer Auth Functions
  registerTrainer,
  loginTrainer,
  getProfile,
  updateTrainerProfile,
  getAssignedEvents,
  getSchedule,
  updateAvailability,
  getStatistics,
  updatePassword,
} = require('../controllers/trainerController');

const {
  protect,
  authorize,
  sameDepartment,
  canAccessResource,
} = require('../middleware/authMiddleware');

const { protectTrainer, requireVerified } = require('../middleware/trainerAuth');

const router = express.Router();

// ==================== TRAINER AUTH ROUTES (PUBLIC) ====================
router.post('/register', registerTrainer);
router.post('/login', loginTrainer);

// ==================== TRAINER PORTAL ROUTES (PROTECTED) ====================
// Profile management
router.get('/profile', protectTrainer, getProfile);
router.put('/profile', protectTrainer, updateTrainerProfile);
router.put('/update-password', protectTrainer, updatePassword);

// Statistics
router.get('/statistics', protectTrainer, getStatistics);

// Events & Schedule (Require verification)
router.get('/events', protectTrainer, requireVerified, getAssignedEvents);
router.get('/schedule', protectTrainer, requireVerified, getSchedule);

// Availability
router.put('/availability', protectTrainer, updateAvailability);

// ==================== ADMIN ROUTES (PROTECTED) ====================

/**
 * 🔒 Protect all trainer routes (JWT required)
 */
router.use(protect);

/**
 * @route   GET /api/trainers/admin/all
 * @desc    Get all trainers (Admin view)
 * @access  Private (Admin roles + Faculty)
 */
router.get(
  '/admin/all',
  protect,
  authorize(
    'superadmin',
    'academic_admin_hod',
    'academic_admin_tp',
    'non_academic_faculty_head',
    'faculty'
  ),
  sameDepartment,
  getAllTrainers
);

/**
 * @route   GET /api/trainers/admin/:id
 * @desc    Get trainer by ID (Admin view)
 * @access  Private (All authorized users)
 */
router.get(
  '/admin/:id',
  protect,
  authorize(
    'superadmin',
    'academic_admin_hod',
    'academic_admin_tp',
    'non_academic_faculty_head',
    'faculty'
  ),
  canAccessResource('faculty'),
  getTrainerById
);

/**
 * @route   POST /api/trainers/admin/create
 * @desc    Create a new trainer (Admin function)
 * @access  Private (Super Admin, HOD, Faculty)
 */
router.post(
  '/admin/create',
  protect,
  authorize('superadmin', 'academic_admin_hod', 'faculty'),
  createTrainer
);

/**
 * @route   PUT /api/trainers/admin/:id
 * @desc    Update a trainer (Admin function)
 * @access  Private (Super Admin, HOD, Faculty)
 */
router.put(
  '/admin/:id',
  protect,
  authorize('superadmin', 'academic_admin_hod', 'faculty'),
  sameDepartment,
  updateTrainer
);

/**
 * @route   DELETE /api/trainers/admin/:id
 * @desc    Delete a trainer
 * @access  Private (Super Admin only)
 */
router.delete('/admin/:id', protect, authorize('superadmin'), deleteTrainer);

module.exports = router;
