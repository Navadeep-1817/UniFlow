const express = require('express');
const {
  initializeSystem,
  createDepartment,
  getUniversities,
  getDepartments,
  getStudentBodies,
  quickRegister,
} = require('../controllers/setupController');

const router = express.Router();

// Initialize system with default data
router.post('/init', initializeSystem);

// Create department
router.post('/department', createDepartment);

// Get all universities (Public - for registration)
router.get('/universities', getUniversities);

// Get all departments (Public - for registration)
router.get('/departments', getDepartments);

// Get all student bodies (Public - for registration)
router.get('/student-bodies', getStudentBodies);

// Quick register for testing (development only)
router.post('/quick-register', quickRegister);

module.exports = router;
