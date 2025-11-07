const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const AcademicAdmin = require('./models/AcademicAdmin');
const NonAcademicAdmin = require('./models/NonAcademicAdmin');
const Department = require('./models/Department');
const StudentBody = require('./models/StudentBody');
const University = require('./models/University');
const { ROLES } = require('./config/roles');

dotenv.config();

const createTestAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get SuperAdmin user first (required for University creation)
    const superAdmin = await User.findOne({ role: 'superadmin' });
    if (!superAdmin) {
      console.log('❌ SuperAdmin not found. Please run seed-superadmin.js first');
      process.exit(1);
    }

    // Get or create university
    let university = await University.findOne({ name: 'Test University' });
    if (!university) {
      university = await University.create({
        name: 'Test University',
        code: 'TU001',
        address: {
          street: '123 University Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        contact: {
          email: 'admin@test.edu',
          phone: '9876543210',
          website: 'https://test.edu'
        },
        establishedYear: 2000,
        affiliationType: 'Autonomous',
        createdBy: superAdmin._id,
        isActive: true
      });
      console.log('✅ Created Test University');
    }

    // Get or create department
    let department = await Department.findOne({ code: 'CSE001' });
    if (!department) {
      department = await Department.create({
        name: 'Computer Science',
        code: 'CSE001',
        university: university._id,
        description: 'Computer Science and Engineering Department'
      });
      console.log('✅ Created CS Department');
    }

    // Get or create student body
    let studentBody = await StudentBody.findOne({ name: 'Sports Club' });
    if (!studentBody) {
      studentBody = await StudentBody.create({
        name: 'Sports Club',
        code: 'SC001',
        type: 'Sports',
        university: university._id,
        description: 'University Sports Club'
      });
      console.log('✅ Created Sports Club\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Creating Test Admin Users');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. HOD (Head of Department)
    let hodUser = await User.findOne({ email: 'hod@test.com' });
    if (!hodUser) {
      hodUser = await User.create({
        name: 'Test HOD',
        email: 'hod@test.com',
        password: 'HOD@123456',
        role: ROLES.ACADEMIC_ADMIN_HOD,
        phone: '1234567890',
        university: university._id,
        department: department._id,
        isActive: true,
        isApproved: true,
        isEmailVerified: true
      });

      await AcademicAdmin.create({
        userId: hodUser._id,
        adminType: 'HOD',
        department: department._id,
        specialization: 'Computer Science',
        experience: 10,
        qualification: 'PhD in Computer Science',
        approvedBy: hodUser._id, // Self-approved for testing
        permissions: {
          canCreateEvents: true,
          canManageFaculty: true,
          canManageStudents: true,
          canApproveEvents: true,
          canBookVenues: true,
          canManageTrainers: true
        }
      });

      console.log('✅ Created HOD User');
      console.log('   Email: hod@test.com');
      console.log('   Password: HOD@123456');
      console.log('   Role: academic_admin_hod\n');
    } else {
      console.log('⚠️  HOD user already exists: hod@test.com\n');
    }

    // 2. Training & Placement Head
    let tpUser = await User.findOne({ email: 'tp@test.com' });
    if (!tpUser) {
      tpUser = await User.create({
        name: 'Test TP Head',
        email: 'tp@test.com',
        password: 'TP@123456',
        role: ROLES.ACADEMIC_ADMIN_TP,
        phone: '1234567891',
        university: university._id,
        department: department._id,
        isActive: true,
        isApproved: true,
        isEmailVerified: true
      });

      await AcademicAdmin.create({
        userId: tpUser._id,
        adminType: 'TP',
        department: department._id,
        specialization: 'Training & Placement',
        experience: 5,
        qualification: 'MBA',
        approvedBy: hodUser._id,
        permissions: {
          canCreateEvents: true,
          canManageFaculty: true,
          canManageStudents: true,
          canApproveEvents: true,
          canBookVenues: true,
          canManageTrainers: true
        }
      });

      console.log('✅ Created Training & Placement Head');
      console.log('   Email: tp@test.com');
      console.log('   Password: TP@123456');
      console.log('   Role: academic_admin_tp\n');
    } else {
      console.log('⚠️  TP user already exists: tp@test.com\n');
    }

    // 3. Non-Academic Faculty Head (Sports)
    let sportsHeadUser = await User.findOne({ email: 'sportshead@test.com' });
    if (!sportsHeadUser) {
      sportsHeadUser = await User.create({
        name: 'Test Sports Head',
        email: 'sportshead@test.com',
        password: 'Sports@123456',
        role: ROLES.NON_ACADEMIC_FACULTY_HEAD,
        phone: '1234567892',
        university: university._id,
        studentBody: studentBody._id,
        isActive: true,
        isApproved: true,
        isEmailVerified: true
      });

      await NonAcademicAdmin.create({
        userId: sportsHeadUser._id,
        adminType: 'FacultyHead',
        studentBody: studentBody._id,
        position: 'Sports Faculty Head',
        tenure: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        },
        approvedBy: hodUser._id,
        permissions: {
          canCreateEvents: true,
          canApproveEvents: true,
          canManageMembers: true,
          canRequestBudget: true,
          canBookVenues: true
        }
      });

      // Update StudentBody with faculty head
      await StudentBody.findByIdAndUpdate(studentBody._id, {
        facultyHead: sportsHeadUser._id
      });

      console.log('✅ Created Sports Faculty Head');
      console.log('   Email: sportshead@test.com');
      console.log('   Password: Sports@123456');
      console.log('   Role: non_academic_faculty_head\n');
    } else {
      console.log('⚠️  Sports Head user already exists: sportshead@test.com\n');
    }

    // 4. Non-Academic Team Representative
    let teamRepUser = await User.findOne({ email: 'teamrep@test.com' });
    if (!teamRepUser) {
      teamRepUser = await User.create({
        name: 'Test Team Rep',
        email: 'teamrep@test.com',
        password: 'TeamRep@123456',
        role: ROLES.NON_ACADEMIC_TEAM_REP,
        phone: '1234567893',
        university: university._id,
        studentBody: studentBody._id,
        isActive: true,
        isApproved: true,
        isEmailVerified: true
      });

      await NonAcademicAdmin.create({
        userId: teamRepUser._id,
        adminType: 'TeamRep',
        studentBody: studentBody._id,
        position: 'Sports Team Representative',
        tenure: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months from now
        },
        approvedBy: sportsHeadUser._id,
        permissions: {
          canCreateEvents: true,
          canApproveEvents: false,
          canManageMembers: true,
          canRequestBudget: true,
          canBookVenues: true
        }
      });

      // Add team rep to StudentBody
      await StudentBody.findByIdAndUpdate(studentBody._id, {
        $addToSet: { teamRepresentatives: teamRepUser._id }
      });

      console.log('✅ Created Team Representative');
      console.log('   Email: teamrep@test.com');
      console.log('   Password: TeamRep@123456');
      console.log('   Role: non_academic_team_rep\n');
    } else {
      console.log('⚠️  Team Rep user already exists: teamrep@test.com\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test Admin Users Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 Summary of Created Users:\n');
    console.log('1. HOD (Head of Department)');
    console.log('   Email: hod@test.com | Password: HOD@123456 | Role: academic_admin_hod\n');
    console.log('2. Training & Placement Head');
    console.log('   Email: tp@test.com | Password: TP@123456 | Role: academic_admin_tp\n');
    console.log('3. Sports Faculty Head');
    console.log('   Email: sportshead@test.com | Password: Sports@123456 | Role: non_academic_faculty_head\n');
    console.log('4. Sports Team Representative');
    console.log('   Email: teamrep@test.com | Password: TeamRep@123456 | Role: non_academic_team_rep\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test admins:', error.message);
    console.error(error);
    process.exit(1);
  }
};

createTestAdmins();
