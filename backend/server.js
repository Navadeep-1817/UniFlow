const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser (for JWT cookies)
const cookieParser = require('cookie-parser');
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


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UniFlow API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'Connected'
  });
});

// Setup routes (for initial data seeding - should be removed in production)
app.use('/api/setup', require('./routes/setupRoutes'));

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));
// API Routes (will be added later)
// Uncomment these when you create the route files
/*
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/superadmin', require('./routes/superAdminRoutes'));
app.use('/api/academic', require('./routes/academicAdminRoutes'));
app.use('/api/non-academic', require('./routes/nonAcademicAdminRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/student-bodies', require('./routes/studentBodyRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
*/

// 404 Handler - FIXED VERSION
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 UniFlow Server Running           ║
  ║   📍 Port: ${PORT}                       ║
  ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
  ║   🔗 Health: http://localhost:${PORT}/health ║
  ╚════════════════════════════════════════╝
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