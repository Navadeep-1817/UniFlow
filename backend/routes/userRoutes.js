const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  updateProfile,
  getMyProfile,
  uploadProfilePicture
} = require('../controllers/userController');

// All user routes require authentication
router.use(protect);

// Current user routes
router.get('/me', getMyProfile);
router.put('/me', updateProfile);
router.put('/me/password', updatePassword);
router.post('/me/profile-picture', uploadProfilePicture);

// Admin routes
router.get(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getAllUsers
);

router.get('/:id', getUser);

router.put(
  '/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD),
  updateUser
);

router.delete(
  '/:id',
  authorize(ROLES.SUPER_ADMIN),
  deleteUser
);

module.exports = router;
