const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');

// All routes require authentication
router.use(protect);

router.post('/', registerForEvent);
router.get('/me', getMyRegistrations);
router.delete('/:id', cancelRegistration);

module.exports = router;
