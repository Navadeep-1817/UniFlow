const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const superAdminController = require('../controllers/superAdminController');

// Protect all routes and ensure superadmin role
router.use(protect);
router.use(authorize(ROLES.SUPER_ADMIN));

router.get('/pending-approvals', superAdminController.getPendingApprovals);
router.post('/approve/:id', superAdminController.approveUser);
router.post('/reject/:id', superAdminController.rejectUser);
router.get('/users', superAdminController.getUsers);
router.get('/stats', superAdminController.getStats);
router.get('/universities', superAdminController.getUniversities);
router.get('/events', superAdminController.getAllEvents);

module.exports = router;
