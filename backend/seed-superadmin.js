const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { ROLES } = require('./config/roles');

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
    
    if (existingSuperAdmin) {
      console.log('⚠️  SuperAdmin already exists:');
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Name: ${existingSuperAdmin.name}`);
      console.log(`   ID: ${existingSuperAdmin._id}`);
      console.log('\n✅ You can login using SUPER_ADMIN_KEY from .env');
      process.exit(0);
    }

    // Create superadmin user
    const superAdmin = await User.create({
      name: 'Super Administrator',
      email: 'superadmin@uniflow.com',
      password: process.env.SUPER_ADMIN_KEY || 'zorogojo',
      role: ROLES.SUPER_ADMIN,
      phone: '0000000000',
      isActive: true,
      isApproved: true, // SuperAdmin is pre-approved
      isEmailVerified: true
    });

    console.log('\n✅ SuperAdmin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SuperAdmin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${superAdmin.email}`);
    console.log(`Password: ${process.env.SUPER_ADMIN_KEY || 'zorogojo'}`);
    console.log(`Role:     ${superAdmin.role}`);
    console.log(`ID:       ${superAdmin._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Note: SuperAdmin can login using the SUPER_ADMIN_KEY from .env');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
