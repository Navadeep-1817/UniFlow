const mongoose = require('mongoose');
const dotenv = require('dotenv');
const University = require('./models/University');
const Department = require('./models/Department');
const User = require('./models/User');
const SuperAdmin = require('./models/SuperAdmin');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedVignanUniversity = async () => {
  try {
    await connectDB();

    // Delete existing data
    console.log('🗑️  Clearing existing data...');
    await Department.deleteMany({});
    await University.deleteMany({});

    // Create or get seed admin user
    console.log('👤 Creating seed admin...');
    let seedAdmin = await User.findOne({ email: 'seed@admin.com' });
    
    if (!seedAdmin) {
      seedAdmin = await User.create({
        name: 'Seed Admin',
        email: 'seed@admin.com',
        password: 'admin123',
        phone: '9999999999',
        role: 'superadmin',
        isApproved: true,
        isActive: true
      });

      await SuperAdmin.create({
        userId: seedAdmin._id,
        isSuperAdmin: true
      });

      console.log('✅ Seed admin created');
    } else {
      console.log('✅ Using existing seed admin');
    }

    // Create Vignan University
    console.log('🏫 Creating Vignan University (VFSTR)...');
    const vignanUniversity = await University.create({
      name: 'Vignan University (VFSTR)',
      code: 'VFSTR',
      address: {
        street: 'Vadlamudi',
        city: 'Guntur',
        state: 'Andhra Pradesh',
        country: 'India',
        pincode: '522213'
      },
      contact: {
        email: 'info@vignanuniversity.org',
        phone: '8632344700', // 10 digits, no dashes
        website: 'https://www.vignanuniversity.org'
      },
      establishedYear: 2008,
      affiliationType: 'Deemed University',
      isActive: true,
      createdBy: seedAdmin._id
    });

    console.log('✅ Vignan University created:', vignanUniversity.name);

    // Create Departments
    console.log('🏛️  Creating Departments...');
    
    const departments = [
      {
        name: 'Computer Science and Engineering',
        code: 'CSE',
        university: vignanUniversity._id,
        description: 'Department of Computer Science and Engineering',
        hodName: 'Dr. CSE HOD',
        contactEmail: 'cse@vignanuniversity.org',
        contactPhone: '8632344701',
        isActive: true
      },
      {
        name: 'Electronics and Communication Engineering',
        code: 'ECE',
        university: vignanUniversity._id,
        description: 'Department of Electronics and Communication Engineering',
        hodName: 'Dr. ECE HOD',
        contactEmail: 'ece@vignanuniversity.org',
        contactPhone: '8632344702',
        isActive: true
      },
      {
        name: 'Electrical and Electronics Engineering',
        code: 'EEE',
        university: vignanUniversity._id,
        description: 'Department of Electrical and Electronics Engineering',
        hodName: 'Dr. EEE HOD',
        contactEmail: 'eee@vignanuniversity.org',
        contactPhone: '8632344703',
        isActive: true
      },
      {
        name: 'Mechanical Engineering',
        code: 'MECH',
        university: vignanUniversity._id,
        description: 'Department of Mechanical Engineering',
        hodName: 'Dr. MECH HOD',
        contactEmail: 'mech@vignanuniversity.org',
        contactPhone: '8632344704',
        isActive: true
      },
      {
        name: 'Civil Engineering',
        code: 'CIVIL',
        university: vignanUniversity._id,
        description: 'Department of Civil Engineering',
        hodName: 'Dr. CIVIL HOD',
        contactEmail: 'civil@vignanuniversity.org',
        contactPhone: '8632344705',
        isActive: true
      },
      {
        name: 'Information Technology',
        code: 'IT',
        university: vignanUniversity._id,
        description: 'Department of Information Technology',
        hodName: 'Dr. IT HOD',
        contactEmail: 'it@vignanuniversity.org',
        contactPhone: '8632344706',
        isActive: true
      },
      {
        name: 'Artificial Intelligence and Data Science',
        code: 'AIDS',
        university: vignanUniversity._id,
        description: 'Department of Artificial Intelligence and Data Science',
        hodName: 'Dr. AIDS HOD',
        contactEmail: 'aids@vignanuniversity.org',
        contactPhone: '8632344707',
        isActive: true
      },
      {
        name: 'Computer Science and Business Systems',
        code: 'CSBS',
        university: vignanUniversity._id,
        description: 'Department of Computer Science and Business Systems',
        hodName: 'Dr. CSBS HOD',
        contactEmail: 'csbs@vignanuniversity.org',
        contactPhone: '8632344708',
        isActive: true
      }
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ Created ${createdDepartments.length} departments`);

    // Update university with department count
    vignanUniversity.totalDepartments = createdDepartments.length;
    await vignanUniversity.save();

    console.log('\n🎉 Seeding Complete!');
    console.log('═══════════════════════════════════════');
    console.log(`University: ${vignanUniversity.name}`);
    console.log(`Code: ${vignanUniversity.code}`);
    console.log(`Departments: ${createdDepartments.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('📋 Departments Created:');
    createdDepartments.forEach((dept, index) => {
      console.log(`   ${index + 1}. ${dept.name} (${dept.code})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedVignanUniversity();
