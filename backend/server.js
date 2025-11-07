const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// ===== IMPORTANT: Register all models BEFORE using them =====
// This prevents "Schema hasn't been registered" errors
require('./models/User');
require('./models/University');
require('./models/Department');
require('./models/Venue');
require('./models/Student');
require('./models/Faculty');
require('./models/AcademicAdmin');
require('./models/NonAcademicAdmin');
require('./models/SuperAdmin');
require('./models/Trainer');
require('./models/StudentBody');
require('./models/Event');
require('./models/Registration');
require('./models/Attendance');
require('./models/Feedback');
require('./models/Notification');
require('./models/Certificate');
require('./models/ApprovalRequest');
require('./models/SportsEvent');
require('./models/PlacementDrive');
require('./models/Timetable');
require('./models/Resource');
require('./models/ActivityReport');
require('./models/AuditLog');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UniFlow API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'Connected'
  });
});

// API Routes
// Setup and Authentication
app.use('/api/setup', require('./routes/setupRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// User Management
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));

// Admin Routes
app.use('/api/superadmin', require('./routes/superAdminRoutes'));
app.use('/api/academic', require('./routes/academicAdminRoutes'));
app.use('/api/non-academic', require('./routes/nonAcademicAdminRoutes'));

// Role-based Routes
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

// Core Event Management
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// Feedback and Certificates (Comment out until controllers are implemented)
// app.use('/api/feedback', require('./routes/feedbackRoutes'));
// app.use('/api/certificates', require('./routes/certificateRoutes'));

// Sports Management (Comment out until controllers are implemented)
// app.use('/api/sports', require('./routes/sportsRoutes'));

// Infrastructure (Comment out until controllers are implemented)
// app.use('/api/venues', require('./routes/venueRoutes'));
// app.use('/api/departments', require('./routes/departmentRoutes'));
// app.use('/api/student-bodies', require('./routes/studentBodyRoutes'));

// System Features (Comment out until controllers are implemented)
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/approvals', require('./routes/approvalRoutes'));
// app.use('/api/conflicts', require('./routes/conflictRoutes'));
// app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
    🚀 UniFlow Server Running
    📍 Port: ${PORT}                       
    🌍 Environment: ${process.env.NODE_ENV || 'development'}      
    🔗 Health: http://localhost:${PORT}/health 
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;