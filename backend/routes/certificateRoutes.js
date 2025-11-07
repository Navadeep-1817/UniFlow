const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');
const {
  generateCertificate,
  getMyCertificates,
  getCertificate,
  verifyCertificate,
  bulkGenerateCertificates,
  downloadCertificate,
  revokeCertificate
} = require('../controllers/certificateController');

// Public routes
router.get('/verify/:certificateId', verifyCertificate);

// Protected routes
router.use(protect);

// Student routes
router.get('/me', getMyCertificates);
router.get('/:id', getCertificate);
router.get('/:id/download', downloadCertificate);

// Admin routes - generate certificates
router.post(
  '/generate',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD, ROLES.FACULTY),
  generateCertificate
);

router.post(
  '/bulk-generate',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  bulkGenerateCertificates
);

router.delete(
  '/:id/revoke',
  authorize(ROLES.SUPER_ADMIN, ROLES.ACADEMIC_ADMIN_HOD, ROLES.ACADEMIC_ADMIN_TP, ROLES.NON_ACADEMIC_FACULTY_HEAD),
  revokeCertificate
);

module.exports = router;
