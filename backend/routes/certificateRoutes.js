const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  generateCertificate,
  getAllCertificates,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
  revokeCertificate,
  bulkGenerateCertificates,
} = require('../controllers/certificateController');

// Public routes
router.get('/verify/:code', verifyCertificate); // Accept both certificateNumber and verificationCode

// Protected specific routes - BEFORE :id
router.get('/my-certificates', protect, authorize(ROLES.STUDENT), getMyCertificates);

// Generate routes
router.post(
  '/generate',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  generateCertificate
);

router.post(
  '/bulk-generate',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  bulkGenerateCertificates
);

// Get all certificates (supports query params like eventId)
router.get(
  '/',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.FACULTY),
  getAllCertificates
);

// Dynamic :id routes - AFTER specific routes
router.get('/:id', protect, getCertificateById);
router.get('/:id/download', protect, downloadCertificate);
router.put(
  '/:id/revoke',
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP),
  revokeCertificate
);

module.exports = router;
