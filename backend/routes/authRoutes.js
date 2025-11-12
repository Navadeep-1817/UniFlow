const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  verifyToken,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  approveUser,
  rejectUser,
  getPendingApprovals,
  deactivateUser,
  activateUser,
  updateProfile,
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes (require authentication)
router.use(protect); // All routes after this require authentication

router.get('/verify', verifyToken); // Verify token and get user
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.put('/update-profile', updateProfile);

// Admin only routes
router.get(
  '/pending-approvals',
  authorize(
    'superadmin',
    'academic_admin_hod',
    'academic_admin_tp',
    'non_academic_faculty_head'
  ),
  getPendingApprovals
);

router.put(
  '/approve/:userId',
  authorize(
    'superadmin',
    'academic_admin_hod',
    'academic_admin_tp',
    'non_academic_faculty_head'
  ),
  approveUser
);

router.put(
  '/reject/:userId',
  authorize(
    'superadmin',
    'academic_admin_hod',
    'academic_admin_tp',
    'non_academic_faculty_head'
  ),
  rejectUser
);

router.put(
  '/deactivate/:userId',
  authorize('superadmin', 'academic_admin_hod'),
  deactivateUser
);

router.put(
  '/activate/:userId',
  authorize('superadmin', 'academic_admin_hod'),
  activateUser
);

module.exports = router;
