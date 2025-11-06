const express = require('express');
const {
  initializeSystem,
  createDepartment,
  getUniversities,
  getDepartments,
  quickRegister,
} = require('../controllers/setupController');

const router = express.Router();

// Initialize system with default data
router.post('/init', initializeSystem);

// Create department
router.post('/department', createDepartment);

// Get all universities
router.get('/universities', getUniversities);

// Get all departments
router.get('/departments', getDepartments);

// Quick register for testing (development only)
router.post('/quick-register', quickRegister);

module.exports = router;
