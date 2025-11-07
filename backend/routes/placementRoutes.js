const express = require('express');
const {
  createPlacementDrive,
  getAllPlacementDrives,
  getPlacementDriveById,
  updatePlacementDrive,
  deletePlacementDrive,
  registerForPlacement,
  updateApplicationStatus,
  recordRound,
  recordOffer,
  getPlacementStats,
  getStudentPlacements
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllPlacementDrives);

// Protected specific routes - MUST come before /:id
router.get('/stats/overview', protect, authorize('Super Admin', 'Academic Admin', 'Non-Academic Admin'), getPlacementStats);
router.get('/my/placements', protect, authorize('Student'), getStudentPlacements);

// Public dynamic route - MUST come after specific routes
router.get('/:id', getPlacementDriveById);

// Student routes
router.post('/:id/register', protect, authorize('Student'), registerForPlacement);

// Admin routes - CRUD
router.post('/', protect, authorize('Super Admin', 'Academic Admin'), createPlacementDrive);
router.put('/:id', protect, authorize('Super Admin', 'Academic Admin'), updatePlacementDrive);
router.delete('/:id', protect, authorize('Super Admin', 'Academic Admin'), deletePlacementDrive);

// Admin routes - Manage applications
router.put('/:id/applications/:studentId', protect, authorize('Super Admin', 'Academic Admin'), updateApplicationStatus);
router.post('/:id/rounds', protect, authorize('Super Admin', 'Academic Admin'), recordRound);
router.post('/:id/offers/:studentId', protect, authorize('Super Admin', 'Academic Admin'), recordOffer);

module.exports = router;
