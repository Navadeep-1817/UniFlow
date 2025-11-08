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

// Trust proxy - Required for Render.com (behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',  // React default
  'http://localhost:5173',  // Vite default
  'http://localhost:5174',  // Vite alternate
  'http://localhost:5175',  // Vite alternate
  'https://uni-flow-phi.vercel.app',  // Production frontend
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('🔒 Allowed CORS Origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview deployments (*.vercel.app)
    if (origin && origin.match(/https:\/\/.*\.vercel\.app$/)) {
      console.log('✅ CORS allowed for Vercel deployment:', origin);
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked for origin:', origin);
      callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
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
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // Increased to 1000 for development
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

// API Health check route (for testing API prefix)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API endpoint is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    endpoints: {
      setup: '/api/setup/universities',
      auth: '/api/auth/login',
      health: '/api/health'
    }
  });
});

// Debug route to check student bodies in DB
app.get('/debug/student-bodies', async (req, res) => {
  try {
    const StudentBody = require('./models/StudentBody');
    const all = await StudentBody.find();
    const active = await StudentBody.find({ isActive: true });
    
    res.json({
      success: true,
      total: all.length,
      active: active.length,
      data: active.map(sb => ({
        _id: sb._id,
        name: sb.name,
        code: sb.code,
        type: sb.type,
        university: sb.university,
        isActive: sb.isActive
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
app.use('/api/hod', require('./routes/hodRoutes'));

// Role-based Routes
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

// Core Event Management
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// Infrastructure Management (NOW ACTIVE)
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/student-bodies', require('./routes/studentBodyRoutes'));

// Feedback and Certificates systems
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));

// Sports Management
app.use('/api/sports', require('./routes/sportsRoutes'));

// Notification System
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Week 3 Systems - Placement, Timetable, Resource
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/timetables', require('./routes/timetableRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Additional System Features (Comment out until controllers are implemented)
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