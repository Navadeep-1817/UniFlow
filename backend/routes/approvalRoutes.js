const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  createApprovalRequest,
  getApprovalRequests,
  getApprovalRequest,
  approveRequest,
  rejectRequest,
  getMyApprovalRequests,
  getPendingApprovals
} = require('../controllers/approvalController');

// All approval routes require authentication
router.use(protect);

// User routes - create and view own requests
router.post('/', createApprovalRequest);
router.get('/me', getMyApprovalRequests);

// Admin routes - view and manage approval requests
router.get(
  '/pending',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getPendingApprovals
);

router.get(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  getApprovalRequests
);

router.get('/:id', getApprovalRequest);

router.post(
  '/:id/approve',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  approveRequest
);

router.post(
  '/:id/reject',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  rejectRequest
);

module.exports = router;
