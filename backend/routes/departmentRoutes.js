const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentFaculty,
  getDepartmentStudents
} = require('../controllers/departmentController');

// All routes require authentication
router.get(
  '/',
  protect,
  getAllDepartments
);

router.get(
  '/:id',
  protect,
  getDepartmentById
);

router.get(
  '/:id/faculty',
  protect,
  getDepartmentFaculty
);

router.get(
  '/:id/students',
  protect,
  getDepartmentStudents
);

router.post(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  createDepartment
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  updateDepartment
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.SUPER_ADMIN),
  deleteDepartment
);

module.exports = router;
