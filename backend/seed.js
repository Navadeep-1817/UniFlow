/**
 * Database Seeding Script for UniFlow
 * Creates realistic test data with proper relationships
 * 
 * Usage:
 *   node seed.js              - Seed if empty
 *   node seed.js --force      - Clear and reseed
 *   node seed.js --clear      - Clear all data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models
const University = require('./models/University');
const Department = require('./models/Department');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const AcademicAdmin = require('./models/AcademicAdmin');
const NonAcademicAdmin = require('./models/NonAcademicAdmin');
const SuperAdmin = require('./models/SuperAdmin');
const Venue = require('./models/Venue');
const StudentBody = require('./models/StudentBody');
const Trainer = require('./models/Trainer');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Attendance = require('./models/Attendance');
const Feedback = require('./models/Feedback');
const Certificate = require('./models/Certificate');
const SportsEvent = require('./models/SportsEvent');
const PlacementDrive = require('./models/PlacementDrive');
const Timetable = require('./models/Timetable');
const Resource = require('./models/Resource');
const Notification = require('./models/Notification');

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Storage for generated IDs
const ids = {
  university: null,
  departments: [],
  users: {
    superAdmin: null,
    hods: [],
    tpOfficer: null,
    sportsHead: null,
    faculty: [],
    students: []
  },
  students: [],
  faculty: [],
  venues: [],
  studentBodies: [],
  trainers: [],
  events: [],
  registrations: [],
  certificates: []
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    log(`✅ MongoDB Connected: ${mongoose.connection.host}`, 'green');
  } catch (error) {
    log(`❌ MongoDB Connection Error: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Clear all collections
const clearDatabase = async () => {
  try {
    log('🗑️  Clearing database...', 'yellow');
    
    await University.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await AcademicAdmin.deleteMany({});
    await NonAcademicAdmin.deleteMany({});
    await SuperAdmin.deleteMany({});
    await Venue.deleteMany({});
    await StudentBody.deleteMany({});
    await Trainer.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Attendance.deleteMany({});
    await Feedback.deleteMany({});
    await Certificate.deleteMany({});
    await SportsEvent.deleteMany({});
    await PlacementDrive.deleteMany({});
    await Timetable.deleteMany({});
    await Resource.deleteMany({});
    await Notification.deleteMany({});
    
    log('✅ Database cleared successfully', 'green');
  } catch (error) {
    log(`❌ Error clearing database: ${error.message}`, 'red');
    throw error;
  }
};

// Check if database already has data
const checkExistingData = async () => {
  const count = await University.countDocuments();
  return count > 0;
};

// Seed SuperAdmin first (needed as createdBy for University)
const seedSuperAdmin = async () => {
  log('\n1️⃣  Seeding SuperAdmin...', 'cyan');
  
  const superAdminUser = await User.create({
    name: 'Super Admin',
    email: 'superadmin@uniflow.com',
    password: await bcrypt.hash(process.env.SUPER_ADMIN_KEY || 'zorogojo', 10),
    phone: '9999999999',
    role: 'superadmin',
    isActive: true,
    isApproved: true
  });
  
  await SuperAdmin.create({
    userId: superAdminUser._id,
    permissions: ['all']
  });
  
  ids.users.superAdmin = superAdminUser._id;
  log('✅ SuperAdmin created', 'green');
  return superAdminUser;
};

// Seed University
const seedUniversity = async () => {
  log('\n2️⃣  Seeding University...', 'cyan');
  
  const university = await University.create({
    name: 'Tech University of Innovation',
    code: 'TUI',
    address: {
      street: '123 University Avenue',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560001'
    },
    contact: {
      email: 'info@tui.edu.in',
      phone: '8012345678',
      website: 'https://www.tui.edu.in'
    },
    establishedYear: 2000,
    affiliationType: 'Autonomous',
    logo: 'https://via.placeholder.com/200x200?text=TUI',
    isActive: true,
    createdBy: ids.users.superAdmin
  });
  
  ids.university = university._id;
  log(`✅ University created: ${university.name}`, 'green');
  return university;
};

// Seed Departments
const seedDepartments = async () => {
  log('\n3️⃣  Seeding Departments...', 'cyan');
  
  const deptData = [
    {
      name: 'Computer Science and Engineering',
      code: 'CSE',
      description: 'Department of Computer Science and Engineering focusing on AI, ML, and Software Development',
      type: 'Engineering',
      establishedYear: 2001
    },
    {
      name: 'Mechanical Engineering',
      code: 'ME',
      description: 'Department of Mechanical Engineering with specialization in Robotics and Automation',
      type: 'Engineering',
      establishedYear: 2001
    },
    {
      name: 'Electrical and Electronics Engineering',
      code: 'EEE',
      description: 'Department of Electrical and Electronics Engineering',
      type: 'Engineering',
      establishedYear: 2002
    },
    {
      name: 'Civil Engineering',
      code: 'CE',
      description: 'Department of Civil Engineering',
      type: 'Engineering',
      establishedYear: 2003
    }
  ];
  
  for (const dept of deptData) {
    const department = await Department.create({
      ...dept,
      university: ids.university,
      contact: {
        email: `${dept.code.toLowerCase()}@tui.edu.in`,
        phone: '8012345678'
      },
      facilities: ['Labs', 'Classrooms', 'Library'],
      isActive: true
    });
    ids.departments.push(department);
  }
  
  log(`✅ ${ids.departments.length} departments created`, 'green');
  return ids.departments;
};

// Seed Users and Profiles
const seedUsers = async () => {
  log('\n4️⃣  Seeding Users...', 'cyan');
  
  // HODs for each department
  const hodData = [
    { name: 'Dr. Rajesh Kumar', email: 'hod.cse@tui.edu.in', dept: 0, phone: '9876543210' },
    { name: 'Dr. Sunita Sharma', email: 'hod.me@tui.edu.in', dept: 1, phone: '9876543211' }
  ];
  
  for (const hod of hodData) {
    const user = await User.create({
      name: hod.name,
      email: hod.email,
      password: await bcrypt.hash('hod123', 10),
      phone: hod.phone,
      role: 'academic_admin_hod',
      university: ids.university,
      department: ids.departments[hod.dept]._id,
      isActive: true,
      isApproved: true
    });
    
    await AcademicAdmin.create({
      userId: user._id,
      department: ids.departments[hod.dept]._id,
      adminType: 'HOD',
      experience: 15,
      qualification: 'Ph.D.'
    });
    
    // Update department with HOD
    await Department.findByIdAndUpdate(ids.departments[hod.dept]._id, { hod: user._id });
    
    ids.users.hods.push(user);
  }
  
  log(`✅ ${ids.users.hods.length} HODs created`, 'green');
  
  // Training & Placement Officer
  const tpUser = await User.create({
    name: 'Prof. Amit Patel',
    email: 'tp@tui.edu.in',
    password: await bcrypt.hash('tp123', 10),
    phone: '9876543212',
    role: 'academic_admin_tp',
    university: ids.university,
    department: ids.departments[0]._id,
    isActive: true,
    isApproved: true
  });
  
  await AcademicAdmin.create({
    userId: tpUser._id,
    department: ids.departments[0]._id,
    adminType: 'TP',
    specialization: 'Training & Placement',
    experience: 10,
    qualification: 'MBA, Ph.D.'
  });
  
  ids.users.tpOfficer = tpUser._id;
  log('✅ T&P Officer created', 'green');
  
  // Faculty
  const facultyData = [
    { name: 'Dr. Priya Menon', email: 'priya.menon@tui.edu.in', dept: 0, designation: 'Professor' },
    { name: 'Prof. Arjun Reddy', email: 'arjun.reddy@tui.edu.in', dept: 0, designation: 'Associate Professor' },
    { name: 'Dr. Kavita Singh', email: 'kavita.singh@tui.edu.in', dept: 1, designation: 'Professor' },
    { name: 'Prof. Vikram Joshi', email: 'vikram.joshi@tui.edu.in', dept: 2, designation: 'Assistant Professor' },
    { name: 'Dr. Neha Gupta', email: 'neha.gupta@tui.edu.in', dept: 0, designation: 'Associate Professor' }
  ];
  
  for (let i = 0; i < facultyData.length; i++) {
    const fac = facultyData[i];
    const user = await User.create({
      name: fac.name,
      email: fac.email,
      password: await bcrypt.hash('faculty123', 10),
      phone: `98765432${20 + i}`,
      role: 'faculty',
      university: ids.university,
      department: ids.departments[fac.dept]._id,
      isActive: true,
      isApproved: true
    });
    
    const faculty = await Faculty.create({
      userId: user._id,
      university: ids.university,
      department: ids.departments[fac.dept]._id,
      employeeId: `FAC${String(i + 1).padStart(4, '0')}`,
      designation: fac.designation,
      qualification: 'Ph.D.',
      specialization: ['Artificial Intelligence', 'Machine Learning', 'Data Science'][i % 3],
      experience: Math.floor(Math.random() * 15) + 5,
      joiningDate: new Date('2015-01-01'),
      publications: Math.floor(Math.random() * 20),
      researchInterests: ['AI', 'ML', 'Deep Learning']
    });
    
    ids.users.faculty.push(user);
    ids.faculty.push(faculty);
  }
  
  log(`✅ ${ids.users.faculty.length} faculty created`, 'green');
  
  // Students
  const batches = ['2021', '2022', '2023', '2024'];
  const years = [4, 3, 2, 1];
  
  for (let i = 0; i < 20; i++) {
    const batchIndex = i % 4;
    const deptIndex = i % 4;
    const rollNumber = `TUI${batches[batchIndex]}${ids.departments[deptIndex].code}${String(i + 1).padStart(3, '0')}`;
    
    const user = await User.create({
      name: `Student ${String.fromCharCode(65 + i)} ${['Kumar', 'Singh', 'Patel', 'Sharma', 'Reddy'][i % 5]}`,
      email: `student${i + 1}@tui.edu.in`,
      password: await bcrypt.hash('student123', 10),
      phone: `98765432${String(30 + i).padStart(2, '0')}`,
      role: 'student',
      university: ids.university,
      department: ids.departments[deptIndex]._id,
      isActive: true,
      isApproved: true
    });
    
    const student = await Student.create({
      userId: user._id,
      university: ids.university,
      department: ids.departments[deptIndex]._id,
      rollNumber: rollNumber,
      batch: batches[batchIndex],
      year: years[batchIndex],
      semester: (years[batchIndex] - 1) * 2 + 1,
      section: ['A', 'B'][i % 2],
      admissionDate: new Date(`${batches[batchIndex]}-07-01`),
      academicDetails: {
        cgpa: parseFloat((Math.random() * 3 + 7).toFixed(2)),
        sgpa: parseFloat((Math.random() * 3 + 7).toFixed(2)),
        backlogs: Math.floor(Math.random() * 3),
        credits: 150,
        status: 'Active'
      },
      personalDetails: {
        dateOfBirth: new Date('2000-01-01'),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
        address: {
          street: '123 Main St',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        }
      },
      parentDetails: {
        fatherName: 'Father Name',
        motherName: 'Mother Name',
        guardianPhone: '9876543200'
      }
    });
    
    ids.users.students.push(user);
    ids.students.push(student);
  }
  
  log(`✅ ${ids.users.students.length} students created`, 'green');
};

// Seed Venues
const seedVenues = async () => {
  log('\n5️⃣  Seeding Venues...', 'cyan');
  
  const venueData = [
    {
      name: 'Seminar Hall 1',
      code: 'SH1',
      type: 'Seminar Hall',
      capacity: 200,
      building: 'Main Building',
      floor: 2,
      facilities: ['Projector', 'Audio System', 'AC', 'Whiteboard']
    },
    {
      name: 'Conference Room',
      code: 'CR1',
      type: 'Conference Room',
      capacity: 50,
      building: 'Admin Block',
      floor: 1,
      facilities: ['Projector', 'Whiteboard', 'AC', 'Video Conferencing']
    },
    {
      name: 'Main Auditorium',
      code: 'AUD',
      type: 'Auditorium',
      capacity: 500,
      building: 'Standalone',
      floor: 1,
      facilities: ['Projector', 'Audio System', 'AC', 'Smart Board']
    },
    {
      name: 'Sports Ground',
      code: 'SG1',
      type: 'Sports Ground',
      capacity: 1000,
      building: 'Outdoor',
      facilities: []
    }
  ];
  
  for (const venue of venueData) {
    const created = await Venue.create({
      ...venue,
      university: ids.university,
      contactPerson: ids.users.faculty[0]._id,
      isActive: true,
      bookings: []
    });
    ids.venues.push(created);
  }
  
  log(`✅ ${ids.venues.length} venues created`, 'green');
};

// Seed Student Bodies
const seedStudentBodies = async () => {
  log('\n6️⃣  Seeding Student Bodies...', 'cyan');
  
  // First create a temporary sports club to assign sports head
  const sportsClub = await StudentBody.create({
    name: 'Sports Club',
    code: 'SC',
    university: ids.university,
    type: 'Sports',
    description: 'University Sports and Athletics Club',
    facultyAdvisor: ids.users.faculty[0]._id, // Temporary
    isActive: true
  });
  
  // Now create Sports Faculty Head
  const sportsUser = await User.create({
    name: 'Prof. Sports Head',
    email: 'sportshead@tui.edu.in',
    password: await bcrypt.hash('sports123', 10),
    phone: '9876543250',
    role: 'non_academic_faculty_head',
    university: ids.university,
    studentBody: sportsClub._id, // Add studentBody here
    isActive: true,
    isApproved: true
  });
  
  await NonAcademicAdmin.create({
    userId: sportsUser._id,
    university: ids.university,
    studentBody: sportsClub._id,
    adminType: 'FacultyHead',
    position: 'Sports Head',
    tenure: {
      startDate: new Date('2020-01-01')
    }
  });
  
  ids.users.sportsHead = sportsUser._id;
  
  // Update sports club with correct faculty advisor
  await StudentBody.findByIdAndUpdate(sportsClub._id, { facultyAdvisor: sportsUser._id });
  
  // Create other clubs
  const culturalClub = await StudentBody.create({
    name: 'Cultural Club',
    code: 'CC',
    university: ids.university,
    type: 'Cultural',
    description: 'Cultural Activities and Events',
    facultyAdvisor: ids.users.faculty[0]._id,
    isActive: true
  });
  
  const techClub = await StudentBody.create({
    name: 'Technical Club',
    code: 'TC',
    university: ids.university,
    type: 'Technical',
    description: 'Technical Activities, Hackathons, and Workshops',
    facultyAdvisor: ids.users.faculty[1]._id,
    isActive: true
  });
  
  ids.studentBodies = [sportsClub, culturalClub, techClub];
  log(`✅ ${ids.studentBodies.length} student bodies created`, 'green');
  log('✅ Sports Head created', 'green');
};

// Seed Trainers
const seedTrainers = async () => {
  log('\n7️⃣  Seeding Trainers...', 'cyan');
  
  const trainers = await Trainer.insertMany([
    {
      name: 'John Smith',
      email: 'john.trainer@external.com',
      phone: '9876543260',
      university: ids.university,
      organization: 'Tech Training Inc.',
      designation: 'Senior Trainer',
      type: 'External',
      expertise: [
        {
          domain: 'Cloud Computing',
          skills: ['AWS', 'Azure', 'GCP'],
          yearsOfExperience: 10
        },
        {
          domain: 'DevOps',
          skills: ['Docker', 'Kubernetes', 'Jenkins'],
          yearsOfExperience: 8
        }
      ],
      specialization: ['Cloud Architecture', 'Microservices'],
      experience: 10,
      bio: 'Expert in cloud technologies with 10+ years experience',
      certifications: ['AWS Certified', 'Kubernetes Administrator'],
      rating: 4.5,
      sessionsCount: 25,
      isActive: true,
      createdBy: ids.users.superAdmin
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.trainer@external.com',
      phone: '9876543261',
      university: ids.university,
      organization: 'Data Science Academy',
      designation: 'Lead Data Scientist',
      type: 'External',
      expertise: [
        {
          domain: 'Machine Learning',
          skills: ['Python', 'TensorFlow', 'PyTorch'],
          yearsOfExperience: 8
        },
        {
          domain: 'Data Science',
          skills: ['Data Analysis', 'Statistics', 'Visualization'],
          yearsOfExperience: 8
        }
      ],
      specialization: ['Deep Learning', 'NLP'],
      experience: 8,
      bio: 'Passionate about teaching ML and AI',
      certifications: ['TensorFlow Certified', 'Google Data Engineer'],
      rating: 4.7,
      sessionsCount: 30,
      isActive: true,
      createdBy: ids.users.superAdmin
    }
  ]);
  
  ids.trainers = trainers;
  log(`✅ ${trainers.length} trainers created`, 'green');
};

// Seed Events
const seedEvents = async () => {
  log('\n8️⃣  Seeding Events...', 'cyan');
  
  const now = new Date();
  
  // Past event (completed)
  const pastEvent = await Event.create({
    title: 'Machine Learning Workshop',
    description: 'Introduction to Machine Learning and Deep Learning with hands-on projects',
    eventCode: 'ML-WS-001',
    type: 'Workshop',
    subType: 'Technical',
    category: 'Academic',
    mode: 'Offline',
    university: ids.university,
    organizer: ids.users.faculty[0]._id,
    organizerModel: 'Faculty',
    coordinators: [ids.users.faculty[1]._id],
    venue: ids.venues[0]._id,
    trainer: ids.trainers[1]._id,
    date: {
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000),
      registrationStart: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      registrationEnd: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000)
    },
    targetAudience: {
      departments: [ids.departments[0]._id],
      years: [2, 3, 4],
      minParticipants: 20,
      maxParticipants: 50
    },
    registration: {
      isRequired: true,
      requiresApproval: false,
      fee: 0,
      maxParticipants: 50,
      currentRegistrations: 30
    },
    attendance: {
      isRequired: true,
      minimumPercentage: 75,
      trackingMethod: 'QR Code'
    },
    feedback: {
      isRequired: true,
      minimumAttendance: 50
    },
    status: 'Completed',
    approval: {
      isRequired: false,
      isApproved: true,
      approvedBy: ids.users.hods[0]._id,
      approvedAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000)
    },
    isPublic: true
  });
  ids.events.push(pastEvent);
  
  // Upcoming event
  const upcomingEvent = await Event.create({
    title: 'Cloud Computing Seminar',
    description: 'AWS and Azure Cloud Services - Enterprise Solutions',
    eventCode: 'CC-SEM-001',
    type: 'Seminar',
    subType: 'Technical',
    category: 'Academic',
    mode: 'Hybrid',
    university: ids.university,
    organizer: ids.users.faculty[1]._id,
    organizerModel: 'Faculty',
    venue: ids.venues[2]._id,
    trainer: ids.trainers[0]._id,
    date: {
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      registrationStart: now,
      registrationEnd: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
    },
    targetAudience: {
      departments: ids.departments.map(d => d._id),
      years: [2, 3, 4],
      maxParticipants: 100
    },
    registration: {
      isRequired: true,
      requiresApproval: false,
      maxParticipants: 100,
      currentRegistrations: 0
    },
    status: 'Approved',
    approval: {
      isRequired: true,
      isApproved: true,
      approvedBy: ids.users.hods[0]._id,
      approvedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    isPublic: true
  });
  ids.events.push(upcomingEvent);
  
  // Ongoing event
  const ongoingEvent = await Event.create({
    title: 'Tech Fest 2024',
    description: 'Annual Technical Festival with competitions, exhibitions, and talks',
    eventCode: 'TF-2024',
    type: 'Festival',
    subType: 'Technical',
    category: 'Cultural',
    mode: 'Offline',
    university: ids.university,
    organizer: ids.users.faculty[2]._id,
    organizerModel: 'Faculty',
    venue: ids.venues[2]._id,
    date: {
      startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      registrationStart: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      registrationEnd: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    targetAudience: {
      maxParticipants: 200
    },
    registration: {
      isRequired: true,
      maxParticipants: 200,
      currentRegistrations: 150
    },
    status: 'Ongoing',
    isPublic: true
  });
  ids.events.push(ongoingEvent);
  
  log(`✅ ${ids.events.length} events created`, 'green');
};

// Seed Registrations, Attendance, Feedback, and Certificates
const seedEventData = async () => {
  log('\n9️⃣  Seeding Event Data (Registrations, Attendance, Feedback, Certificates)...', 'cyan');
  
  const pastEvent = ids.events[0];
  const now = new Date();
  
  // Create registrations for past event
  for (let i = 0; i < 30; i++) {
    const registration = await Registration.create({
      event: pastEvent._id,
      student: ids.students[i]._id,
      user: ids.users.students[i]._id,
      registrationNumber: `REG-${pastEvent.eventCode}-${String(i + 1).padStart(3, '0')}`,
      status: 'Confirmed',
      registeredAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      paymentStatus: 'Completed'
    });
    ids.registrations.push(registration);
    
    // Create attendance for first 25 students
    if (i < 25) {
      await Attendance.create({
        event: pastEvent._id,
        student: ids.students[i]._id,
        user: ids.users.students[i]._id,
        registration: registration._id,
        status: 'Present',
        checkInTime: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000),
        markedBy: ids.users.faculty[0]._id,
        verificationMethod: 'QR Code'
      });
    }
  }
  
  log(`✅ ${ids.registrations.length} registrations created`, 'green');
  log(`✅ 25 attendance records created`, 'green');
  
  // Create feedback for past event
  for (let i = 0; i < 20; i++) {
    await Feedback.create({
      event: pastEvent._id,
      student: ids.students[i]._id,
      user: ids.users.students[i]._id,
      registration: ids.registrations[i]._id,
      ratings: {
        overall: Math.floor(Math.random() * 2) + 4,
        content: Math.floor(Math.random() * 2) + 4,
        trainer: 5,
        venue: 4,
        organization: Math.floor(Math.random() * 2) + 4
      },
      comments: 'Excellent workshop! Learned a lot about Machine Learning. The trainer was very knowledgeable and explained concepts clearly.',
      wouldRecommend: true,
      suggestions: 'More hands-on projects would be great',
      isAnonymous: false,
      submittedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)
    });
  }
  
  log(`✅ 20 feedback records created`, 'green');
  
  // Create certificates for attendees
  for (let i = 0; i < 25; i++) {
    const certificate = await Certificate.create({
      event: pastEvent._id,
      student: ids.students[i]._id,
      user: ids.users.students[i]._id,
      registration: ids.registrations[i]._id,
      certificateNumber: `CERT-2024-${String(i + 1).padStart(4, '0')}`,
      verificationCode: `VER-${Date.now()}-${String(Math.random()).substring(2, 10)}`,
      type: 'Participation',
      issuedDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      issuedBy: ids.users.faculty[0]._id,
      validUntil: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
      status: 'Active',
      attendancePercentage: 100,
      grade: ['A+', 'A', 'B+'][i % 3],
      remarks: 'Excellent participation',
      downloadCount: Math.floor(Math.random() * 5)
    });
    ids.certificates.push(certificate);
  }
  
  log(`✅ ${ids.certificates.length} certificates created`, 'green');
};

// Seed Sports Events
const seedSportsEvents = async () => {
  log('\n9️⃣  Seeding Sports Events...', 'cyan');
  
  const now = new Date();
  
  await SportsEvent.insertMany([
    {
      title: 'Inter-Department Cricket Tournament',
      description: 'Annual cricket competition between all departments',
      eventCode: 'CR-TOUR-001',
      sport: 'Cricket',
      university: ids.university,
      organizer: ids.users.sportsHead,
      venue: ids.venues[3]._id,
      date: {
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000)
      },
      type: 'Team',
      tournamentFormat: 'League',
      teamSize: { min: 11, max: 15 },
      maxTeams: 4,
      eligibility: {
        departments: ids.departments.map(d => d._id),
        years: [1, 2, 3, 4]
      },
      prizes: {
        first: 10000,
        second: 5000,
        third: 2500
      },
      rules: 'Standard cricket rules apply',
      status: 'Open',
      isPublic: true
    },
    {
      title: 'Annual Athletics Meet',
      description: 'Track and field events including 100m, 200m, relay, long jump, high jump',
      eventCode: 'ATH-MEET-001',
      sport: 'Athletics',
      university: ids.university,
      organizer: ids.users.sportsHead,
      venue: ids.venues[3]._id,
      date: {
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000)
      },
      type: 'Individual',
      maxParticipants: 200,
      eligibility: {
        years: [1, 2, 3, 4]
      },
      events: [
        { name: '100m Sprint', category: 'Track' },
        { name: '200m Sprint', category: 'Track' },
        { name: '4x100m Relay', category: 'Track' },
        { name: 'Long Jump', category: 'Field' },
        { name: 'High Jump', category: 'Field' }
      ],
      status: 'Upcoming',
      isPublic: true
    }
  ]);
  
  log('✅ 2 sports events created', 'green');
};

// Seed Placement Drives
const seedPlacements = async () => {
  log('\n🔟 Seeding Placement Drives...', 'cyan');
  
  const now = new Date();
  
  await PlacementDrive.insertMany([
    {
      event: ids.events[1]._id, // Link to upcoming event
      university: ids.university,
      organizer: ids.users.tpOfficer,
      company: {
        name: 'Tech Giants Inc.',
        website: 'https://techgiants.com',
        industry: 'Information Technology',
        size: '10000+',
        description: 'Leading technology company specializing in cloud solutions'
      },
      jobDetails: {
        role: 'Software Engineer',
        type: 'Full-time',
        location: 'Bangalore, India',
        ctc: { min: 800000, max: 1200000, currency: 'INR' },
        description: 'Full-stack development role working on cloud platforms',
        skills: ['Java', 'Python', 'React', 'AWS', 'Docker']
      },
      eligibilityCriteria: {
        cgpa: 7.0,
        maxBacklogs: 0,
        departments: [ids.departments[0]._id, ids.departments[2]._id],
        batches: ['2024', '2023']
      },
      importantDates: {
        registrationStart: now,
        registrationEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        driveDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000)
      },
      rounds: [
        { name: 'Aptitude Test', type: 'Online', duration: 60, description: 'Quantitative, Logical, Verbal' },
        { name: 'Technical Round 1', type: 'Interview', duration: 45, description: 'Data Structures & Algorithms' },
        { name: 'Technical Round 2', type: 'Interview', duration: 45, description: 'System Design' },
        { name: 'HR Round', type: 'Interview', duration: 30, description: 'Behavioral questions' }
      ],
      venue: ids.venues[1]._id,
      maxApplications: 100,
      status: 'Open',
      isActive: true
    },
    {
      university: ids.university,
      organizer: ids.users.tpOfficer,
      company: {
        name: 'DataCorp Solutions',
        website: 'https://datacorp.com',
        industry: 'Analytics',
        size: '1000-5000',
        description: 'Data analytics and business intelligence company'
      },
      jobDetails: {
        role: 'Data Analyst',
        type: 'Full-time',
        location: 'Mumbai, India',
        ctc: { min: 600000, max: 900000, currency: 'INR' },
        description: 'Data analysis, visualization, and reporting',
        skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics']
      },
      eligibilityCriteria: {
        cgpa: 6.5,
        maxBacklogs: 1,
        departments: [ids.departments[0]._id, ids.departments[1]._id],
        batches: ['2024']
      },
      importantDates: {
        registrationStart: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        registrationEnd: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        driveDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
      },
      rounds: [
        { name: 'Online Test', type: 'Online', duration: 90, description: 'SQL, Python, Statistics' },
        { name: 'Technical Interview', type: 'Interview', duration: 60, description: 'Case studies' },
        { name: 'HR Interview', type: 'Interview', duration: 30, description: 'Final round' }
      ],
      venue: ids.venues[0]._id,
      maxApplications: 50,
      status: 'Scheduled',
      isActive: true
    }
  ]);
  
  log('✅ 2 placement drives created', 'green');
};

// Seed Timetables
const seedTimetables = async () => {
  log('\n1️⃣1️⃣  Seeding Timetables...', 'cyan');
  
  await Timetable.create({
    title: 'CSE Semester 1 - 2024-2025',
    university: ids.university,
    department: ids.departments[0]._id,
    academicYear: '2024-2025',
    semester: 1,
    effectiveFrom: new Date('2024-08-01'),
    effectiveTo: new Date('2024-12-31'),
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      slots: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '10:00',
          subject: 'Data Structures',
          faculty: ids.faculty[0]._id,
          venue: ids.venues[0]._id,
          type: 'Lecture'
        },
        {
          day: 'Monday',
          startTime: '10:00',
          endTime: '11:00',
          subject: 'Algorithms',
          faculty: ids.faculty[1]._id,
          venue: ids.venues[0]._id,
          type: 'Lecture'
        },
        {
          day: 'Tuesday',
          startTime: '09:00',
          endTime: '11:00',
          subject: 'Database Lab',
          faculty: ids.faculty[0]._id,
          venue: ids.venues[1]._id,
          type: 'Lab'
        }
      ]
    },
    breaks: [
      { name: 'Tea Break', startTime: '11:00', endTime: '11:15' },
      { name: 'Lunch Break', startTime: '13:00', endTime: '14:00' }
    ],
    status: 'Published',
    publishedBy: ids.users.hods[0]._id,
    publishedAt: new Date()
  });
  
  log('✅ 1 timetable created', 'green');
};

// Seed Resources
const seedResources = async () => {
  log('\n1️⃣2️⃣  Seeding Resources...', 'cyan');
  
  await Resource.insertMany([
    {
      title: 'Machine Learning Lecture Notes',
      description: 'Comprehensive notes covering supervised and unsupervised learning',
      type: 'Document',
      category: 'Notes',
      fileUrl: 'https://example.com/ml-notes.pdf',
      fileName: 'ml-notes.pdf',
      fileSize: 2048000,
      mimeType: 'application/pdf',
      uploadedBy: ids.users.faculty[0]._id,
      event: ids.events[0]._id,
      university: ids.university,
      department: ids.departments[0]._id,
      visibility: 'Registered',
      tags: ['ML', 'AI', 'Notes', 'Workshop'],
      downloads: 45,
      views: 120,
      isActive: true
    },
    {
      title: 'Cloud Computing Presentation',
      description: 'AWS and Azure services overview with examples',
      type: 'Presentation',
      category: 'Slides',
      fileUrl: 'https://example.com/cloud-slides.pptx',
      fileName: 'cloud-slides.pptx',
      fileSize: 5120000,
      mimeType: 'application/vnd.ms-powerpoint',
      uploadedBy: ids.users.faculty[1]._id,
      event: ids.events[1]._id,
      university: ids.university,
      visibility: 'Public',
      tags: ['Cloud', 'AWS', 'Azure', 'DevOps'],
      downloads: 0,
      views: 0,
      isActive: true
    }
  ]);
  
  log('✅ 2 resources created', 'green');
};

// Seed Notifications
const seedNotifications = async () => {
  log('\n1️⃣3️⃣  Seeding Notifications...', 'cyan');
  
  const now = new Date();
  
  // Send notifications to first 5 students about upcoming event
  for (let i = 0; i < 5; i++) {
    await Notification.create({
      recipient: ids.users.students[i]._id,
      title: 'New Event Registration Open',
      message: `Registration is now open for ${ids.events[1].title}. Don't miss this opportunity!`,
      type: 'Event',
      priority: 'Medium',
      channels: ['inApp', 'email'],
      relatedEntity: {
        type: 'Event',
        id: ids.events[1]._id
      },
      status: 'Sent',
      sentAt: now,
      isRead: false
    });
  }
  
  log('✅ 5 notifications created', 'green');
};

// Main seeding function
const seedDatabase = async () => {
  try {
    log('\n🌱 Starting Database Seeding...', 'cyan');
    log('=' .repeat(60), 'cyan');
    
    await seedSuperAdmin();
    await seedUniversity();
    await seedDepartments();
    await seedUsers();
    await seedVenues();
    await seedStudentBodies();
    await seedTrainers();
    await seedEvents();
    await seedEventData();
    await seedSportsEvents();
    await seedPlacements();
    await seedTimetables();
    await seedResources();
    await seedNotifications();
    
    log('\n' + '='.repeat(60), 'green');
    log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉', 'green');
    log('='.repeat(60), 'green');
    
    log('\n📊 SEEDING SUMMARY:', 'cyan');
    log(`✅ 1 University`, 'green');
    log(`✅ ${ids.departments.length} Departments`, 'green');
    log(`✅ ${ids.users.students.length + ids.users.faculty.length + ids.users.hods.length + 3} Users`, 'green');
    log(`✅ ${ids.students.length} Students`, 'green');
    log(`✅ ${ids.faculty.length} Faculty`, 'green');
    log(`✅ ${ids.venues.length} Venues`, 'green');
    log(`✅ ${ids.studentBodies.length} Student Bodies`, 'green');
    log(`✅ ${ids.trainers.length} Trainers`, 'green');
    log(`✅ ${ids.events.length} Events`, 'green');
    log(`✅ ${ids.registrations.length} Registrations`, 'green');
    log(`✅ 25 Attendance Records`, 'green');
    log(`✅ 20 Feedback Records`, 'green');
    log(`✅ ${ids.certificates.length} Certificates`, 'green');
    log(`✅ 2 Sports Events`, 'green');
    log(`✅ 2 Placement Drives`, 'green');
    log(`✅ 1 Timetable`, 'green');
    log(`✅ 2 Resources`, 'green');
    log(`✅ 5 Notifications`, 'green');
    
    log('\n📝 TEST ACCOUNTS:', 'yellow');
    log('SuperAdmin: superadmin@uniflow.com / ' + (process.env.SUPER_ADMIN_KEY || 'zorogojo'), 'yellow');
    log('HOD (CSE): hod.cse@tui.edu.in / hod123', 'yellow');
    log('T&P Officer: tp@tui.edu.in / tp123', 'yellow');
    log('Faculty: priya.menon@tui.edu.in / faculty123', 'yellow');
    log('Student: student1@tui.edu.in / student123', 'yellow');
    log('', 'reset');
    
  } catch (error) {
    log(`\n❌ SEEDING FAILED: ${error.message}`, 'red');
    console.error(error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    
    // Handle command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--clear')) {
      await clearDatabase();
      log('\n✅ Database cleared successfully', 'green');
      process.exit(0);
    }
    
    // Check for existing data
    const hasData = await checkExistingData();
    
    if (hasData && !args.includes('--force')) {
      log('\n⚠️  Database already contains data!', 'yellow');
      log('Use --force flag to clear and reseed: node seed.js --force', 'yellow');
      log('Use --clear flag to only clear data: node seed.js --clear', 'yellow');
      process.exit(0);
    }
    
    if (args.includes('--force')) {
      await clearDatabase();
    }
    
    await seedDatabase();
    
    log('\n✅ Seeding completed. You can now start the server and run tests!', 'green');
    log('💡 Run tests: node test100.js\n', 'cyan');
    
    process.exit(0);
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Run the seeding
main();
