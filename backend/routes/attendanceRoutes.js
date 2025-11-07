const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { markAttendance, getEventAttendance } = require('../controllers/attendanceController');

router.use(protect);

router.post('/mark', markAttendance);
router.get('/event/:eventId', getEventAttendance);

module.exports = router;
