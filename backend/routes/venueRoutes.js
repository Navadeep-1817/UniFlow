const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  checkVenueAvailability,
  getVenueSchedule
} = require('../controllers/venueController');

// Public routes
router.get('/', getVenues);
router.get('/:id', getVenue);
router.get('/:id/schedule', getVenueSchedule);
router.post('/check-availability', checkVenueAvailability);

// Protected routes
router.post(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  createVenue
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  updateVenue
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN),
  deleteVenue
);

module.exports = router;
