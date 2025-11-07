const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getDepartmentFaculty,
  getDepartmentStudents
} = require('../controllers/departmentController');

// Public routes
router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.get('/:id/stats', protect, getDepartmentStats);
router.get('/:id/faculty', protect, getDepartmentFaculty);
router.get('/:id/students', protect, getDepartmentStudents);

// Protected routes
router.post(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD),
  createDepartment
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD),
  updateDepartment
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN),
  deleteDepartment
);

module.exports = router;
