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
} = require('../controllers/trainerController');

const {
  protect,
  authorize,
  sameDepartment,
  canAccessResource,
} = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 🔒 Protect all trainer routes (JWT required)
 */
router.use(protect);

/**
 * @route   POST /api/trainers
 * @desc    Create a new trainer
 * @access  Private (Super Admin, HOD, Faculty)
 */
router.post(
  '/',
  authorize('superadmin', 'academic_admin_hod', 'faculty'),
  createTrainer
);

/**
 * @route   GET /api/trainers
 * @desc    Get all trainers
 * @access  Private (Admin roles + Faculty)
 */
router.get(
  '/',
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
 * @route   GET /api/trainers/:id
 * @desc    Get trainer by ID
 * @access  Private (All authorized users)
 */
router.get(
  '/:id',
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
 * @route   PUT /api/trainers/:id
 * @desc    Update a trainer
 * @access  Private (Super Admin, HOD, Faculty)
 */
router.put(
  '/:id',
  authorize('superadmin', 'academic_admin_hod', 'faculty'),
  sameDepartment,
  updateTrainer
);

/**
 * @route   DELETE /api/trainers/:id
 * @desc    Delete a trainer
 * @access  Private (Super Admin only)
 */
router.delete('/:id', authorize('superadmin'), deleteTrainer);

module.exports = router;
