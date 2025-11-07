const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Generate certificate for a student
 * @route   POST /api/certificates
 * @access  Private (Admins, Faculty)
 */
const generateCertificate = asyncHandler(async (req, res) => {
  const {
    eventId,
    studentId,
    certificateType,
    title,
    description,
    grade,
    score,
    achievements,
    skills,
    templateId,
    signatories,
    validUntil,
  } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if student is registered
  const registration = await Registration.findOne({
    eventId,
    studentId,
    status: 'Approved',
  });

  if (!registration) {
    res.status(404);
    throw new Error('Student is not registered for this event');
  }

  // Check if certificate already exists
  const existingCertificate = await Certificate.findOne({
    eventId,
    studentId,
    isRevoked: false,
  });

  if (existingCertificate) {
    res.status(400);
    throw new Error('Certificate already exists for this student and event');
  }

  // Calculate attendance percentage
  const attendanceRecords = await Attendance.find({
    eventId,
    studentId,
    status: 'Present',
  });

  const attendancePercentage =
    event.sessions && event.sessions.length > 0
      ? (attendanceRecords.length / event.sessions.length) * 100
      : 0;

  // Check minimum attendance requirement (e.g., 75%)
  if (attendancePercentage < 75 && certificateType === 'Completion') {
    res.status(400);
    throw new Error(
      `Minimum 75% attendance required for completion certificate. Student attendance: ${attendancePercentage.toFixed(
        2
      )}%`
    );
  }

  // Create certificate
  const certificate = await Certificate.create({
    eventId,
    registrationId: registration._id,
    studentId,
    certificateType: certificateType || 'Participation',
    title: title || `Certificate of ${certificateType || 'Participation'}`,
    description:
      description ||
      `This certifies that the student has successfully participated in ${event.title}`,
    grade,
    score,
    attendancePercentage: attendancePercentage.toFixed(2),
    achievements,
    skills,
    templateId,
    signatories,
    validUntil,
    issuedBy: req.user._id,
    issuedDate: new Date(),
  });

  // Populate certificate data
  const populatedCertificate = await Certificate.findById(certificate._id)
    .populate('eventId', 'title eventType startDate endDate')
    .populate('studentId', 'name email rollNumber')
    .populate('issuedBy', 'name email')
    .populate('registrationId', 'registrationDate');

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Certificate Generated',
    resource: 'Certificate',
    resourceId: certificate._id,
    details: `Certificate generated for student: ${studentId}, event: ${event.title}`,
  });

  res.status(201).json({
    success: true,
    message: 'Certificate generated successfully',
    data: populatedCertificate,
  });
});

/**
 * @desc    Get all certificates with filters
 * @route   GET /api/certificates
 * @access  Private (Admins, Faculty)
 */
const getAllCertificates = asyncHandler(async (req, res) => {
  const {
    eventId,
    studentId,
    certificateType,
    isRevoked,
    minAttendance,
    page = 1,
    limit = 20,
    sortBy = '-issuedDate',
  } = req.query;

  // Build query
  const query = {};

  if (eventId) query.eventId = eventId;
  if (studentId) query.studentId = studentId;
  if (certificateType) query.certificateType = certificateType;
  if (isRevoked !== undefined) query.isRevoked = isRevoked === 'true';
  if (minAttendance) query.attendancePercentage = { $gte: parseFloat(minAttendance) };

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const certificates = await Certificate.find(query)
    .populate('eventId', 'title eventType startDate endDate')
    .populate('studentId', 'name email rollNumber')
    .populate('issuedBy', 'name email')
    .populate('registrationId', 'registrationDate')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const total = await Certificate.countDocuments(query);

  res.status(200).json({
    success: true,
    count: certificates.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: certificates,
  });
});

/**
 * @desc    Get my certificates
 * @route   GET /api/certificates/my-certificates
 * @access  Private (Student only)
 */
const getMyCertificates = asyncHandler(async (req, res) => {
  const { certificateType, page = 1, limit = 20, sortBy = '-issuedDate' } = req.query;

  // Build query
  const query = {
    studentId: req.user._id,
    isRevoked: false,
  };

  if (certificateType) query.certificateType = certificateType;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const certificates = await Certificate.find(query)
    .populate('eventId', 'title eventType startDate endDate')
    .populate('issuedBy', 'name email')
    .populate('registrationId', 'registrationDate')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const total = await Certificate.countDocuments(query);

  res.status(200).json({
    success: true,
    count: certificates.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: certificates,
  });
});

/**
 * @desc    Get certificate by ID
 * @route   GET /api/certificates/:id
 * @access  Private
 */
const getCertificateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const certificate = await Certificate.findById(id)
    .populate('eventId', 'title eventType startDate endDate')
    .populate('studentId', 'name email rollNumber')
    .populate('issuedBy', 'name email')
    .populate('verifiedBy', 'name email')
    .populate('revokedBy', 'name email')
    .populate('registrationId', 'registrationDate');

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  // Check authorization (student can only view their own, admins can view all)
  const isStudent = req.user.role === 'Student';
  const isOwnCertificate = certificate.studentId._id.toString() === req.user._id.toString();

  if (isStudent && !isOwnCertificate) {
    res.status(403);
    throw new Error('Not authorized to view this certificate');
  }

  res.status(200).json({
    success: true,
    data: certificate,
  });
});

/**
 * @desc    Verify certificate
 * @route   GET /api/certificates/verify/:code
 * @access  Public
 */
const verifyCertificate = asyncHandler(async (req, res) => {
  const { code } = req.params;

  // Try to find certificate by certificateNumber or verificationCode
  let certificate = await Certificate.findOne({
    $or: [
      { certificateNumber: code },
      { verificationCode: code }
    ]
  })
    .populate('eventId', 'title eventType startDate endDate')
    .populate('studentId', 'name email rollNumber')
    .populate('issuedBy', 'name email');

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found or invalid verification code',
      verified: false
    });
  }

  // Verify certificate
  const verificationResult = await certificate.verify();

  res.status(200).json({
    success: true,
    data: {
      ...verificationResult,
      eventTitle: certificate.eventId?.title,
      studentName: certificate.studentId?.name,
      certificateType: certificate.certificateType,
      issuedDate: certificate.issuedDate,
      issuedBy: certificate.issuedBy?.name,
      attendancePercentage: certificate.attendancePercentage,
      grade: certificate.grade,
    },
  });
});

/**
 * @desc    Download certificate
 * @route   GET /api/certificates/download/:id
 * @access  Private (Student - their own, Admins - all)
 */
const downloadCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const certificate = await Certificate.findById(id)
    .populate('eventId', 'title eventType startDate endDate')
    .populate('studentId', 'name email rollNumber')
    .populate('issuedBy', 'name email');

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  // Check if certificate is revoked
  if (certificate.isRevoked) {
    res.status(400);
    throw new Error('This certificate has been revoked and cannot be downloaded');
  }

  // Check authorization
  const isStudent = req.user.role === 'Student';
  const isOwnCertificate = certificate.studentId._id.toString() === req.user._id.toString();

  if (isStudent && !isOwnCertificate) {
    res.status(403);
    throw new Error('Not authorized to download this certificate');
  }

  // Increment download counter
  await certificate.incrementDownloads();

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Certificate Downloaded',
    resource: 'Certificate',
    resourceId: certificate._id,
    details: `Certificate downloaded: ${certificate.certificateNumber}`,
  });

  // In a real implementation, this would generate a PDF
  // For now, return certificate data
  res.status(200).json({
    success: true,
    message: 'Certificate ready for download',
    data: {
      certificateNumber: certificate.certificateNumber,
      certificateType: certificate.certificateType,
      title: certificate.title,
      description: certificate.description,
      studentName: certificate.studentId?.name,
      studentEmail: certificate.studentId?.email,
      rollNumber: certificate.studentId?.rollNumber,
      eventTitle: certificate.eventId?.title,
      eventType: certificate.eventId?.eventType,
      eventDates: {
        start: certificate.eventId?.startDate,
        end: certificate.eventId?.endDate,
      },
      issuedDate: certificate.issuedDate,
      issuedBy: certificate.issuedBy?.name,
      attendancePercentage: certificate.attendancePercentage,
      grade: certificate.grade,
      score: certificate.score,
      achievements: certificate.achievements,
      skills: certificate.skills,
      signatories: certificate.signatories,
      verificationCode: certificate.verificationCode,
      qrCode: certificate.qrCode,
      downloads: certificate.downloads,
    },
  });
});

/**
 * @desc    Revoke certificate
 * @route   PUT /api/certificates/revoke/:id
 * @access  Private (Super Admin, Academic Admins)
 */
const revokeCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim() === '') {
    res.status(400);
    throw new Error('Revocation reason is required');
  }

  const certificate = await Certificate.findById(id);

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  if (certificate.isRevoked) {
    res.status(400);
    throw new Error('Certificate is already revoked');
  }

  // Revoke certificate
  await certificate.revoke(req.user._id, reason);

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Certificate Revoked',
    resource: 'Certificate',
    resourceId: certificate._id,
    details: `Certificate revoked: ${certificate.certificateNumber}. Reason: ${reason}`,
  });

  res.status(200).json({
    success: true,
    message: 'Certificate revoked successfully',
    data: certificate,
  });
});

/**
 * @desc    Bulk generate certificates for an event
 * @route   POST /api/certificates/bulk-generate
 * @access  Private (Admins, Faculty)
 */
const bulkGenerateCertificates = asyncHandler(async (req, res) => {
  const {
    eventId,
    certificateType,
    minAttendancePercentage = 75,
    templateId,
    signatories,
    validUntil,
  } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Get all approved registrations
  const registrations = await Registration.find({
    eventId,
    status: 'Approved',
  });

  if (registrations.length === 0) {
    res.status(404);
    throw new Error('No approved registrations found for this event');
  }

  const results = {
    total: registrations.length,
    generated: 0,
    skipped: 0,
    errors: [],
  };

  // Process each registration
  for (const registration of registrations) {
    try {
      // Check if certificate already exists
      const existingCertificate = await Certificate.findOne({
        eventId,
        studentId: registration.studentId,
        isRevoked: false,
      });

      if (existingCertificate) {
        results.skipped++;
        continue;
      }

      // Calculate attendance
      const attendanceRecords = await Attendance.find({
        eventId,
        studentId: registration.studentId,
        status: 'Present',
      });

      const attendancePercentage =
        event.sessions && event.sessions.length > 0
          ? (attendanceRecords.length / event.sessions.length) * 100
          : 0;

      // Skip if below minimum attendance
      if (attendancePercentage < minAttendancePercentage) {
        results.skipped++;
        results.errors.push({
          studentId: registration.studentId,
          reason: `Attendance ${attendancePercentage.toFixed(2)}% below minimum ${minAttendancePercentage}%`,
        });
        continue;
      }

      // Generate certificate
      await Certificate.create({
        eventId,
        registrationId: registration._id,
        studentId: registration.studentId,
        certificateType: certificateType || 'Participation',
        title: `Certificate of ${certificateType || 'Participation'}`,
        description: `This certifies successful participation in ${event.title}`,
        attendancePercentage: attendancePercentage.toFixed(2),
        templateId,
        signatories,
        validUntil,
        issuedBy: req.user._id,
        issuedDate: new Date(),
      });

      results.generated++;
    } catch (error) {
      results.errors.push({
        studentId: registration.studentId,
        reason: error.message,
      });
    }
  }

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Bulk Certificates Generated',
    resource: 'Certificate',
    resourceId: eventId,
    details: `Bulk certificates generated for event: ${event.title}. Generated: ${results.generated}, Skipped: ${results.skipped}`,
  });

  res.status(200).json({
    success: true,
    message: `Bulk certificate generation completed. Generated: ${results.generated}, Skipped: ${results.skipped}`,
    data: results,
  });
});

module.exports = {
  generateCertificate,
  getAllCertificates,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
  revokeCertificate,
  bulkGenerateCertificates,
};
