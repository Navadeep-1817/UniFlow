const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  checkAvailability,
  getVenueEvents
} = require('../controllers/venueController');

// All routes require authentication
router.get(
  '/',
  protect,
  getAllVenues
);

router.get(
  '/:id',
  protect,
  getVenueById
);

router.get(
  '/:id/events',
  protect,
  getVenueEvents
);

router.post(
  '/:id/check-availability',
  protect,
  checkAvailability
);

router.post(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  createVenue
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  updateVenue
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN),
  deleteVenue
);

module.exports = router;
