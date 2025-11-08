const mongoose = require('mongoose');
const dotenv = require('dotenv');
const University = require('./models/University');
const StudentBody = require('./models/StudentBody');

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

const seedStudentBodies = async () => {
  try {
    await connectDB();

    // Find Vignan University
    console.log('🔍 Finding Vignan University...');
    const vignanUniversity = await University.findOne({ code: 'VFSTR' });
    
    if (!vignanUniversity) {
      console.error('❌ Vignan University not found! Please run seedVignanUniversity.js first.');
      process.exit(1);
    }

    console.log('✅ Found Vignan University:', vignanUniversity.name);
    console.log('   University ID:', vignanUniversity._id);

    // Check existing student bodies
    console.log('🔍 Checking existing student bodies...');
    const existingBodies = await StudentBody.find({ university: vignanUniversity._id });
    console.log(`   Found ${existingBodies.length} existing student bodies:`);
    existingBodies.forEach(body => {
      console.log(`      - ${body.name} (${body.code}) - Type: ${body.type}`);
    });

    // Delete existing student bodies for this university
    console.log('\n🗑️  Clearing existing student bodies for Vignan University...');
    const deletedCount = await StudentBody.deleteMany({ university: vignanUniversity._id });
    console.log(`   Deleted ${deletedCount.deletedCount} existing student bodies`);

    // Create Student Bodies
    console.log('\n🏢 Creating Student Bodies...');
    
    const studentBodies = [
      {
        name: 'E-Cell (Entrepreneurship Cell)',
        code: 'ECELL',
        type: 'Technical',
        university: vignanUniversity._id,
        description: 'Entrepreneurship Cell - Fostering entrepreneurial spirit and innovation among students through workshops, competitions, and startup mentorship programs.',
        objectives: [
          'Promote entrepreneurial culture on campus',
          'Organize startup workshops and bootcamps',
          'Connect students with industry mentors',
          'Host business plan competitions',
          'Provide incubation support for student startups'
        ],
        contactEmail: 'ecell@vignanuniversity.org',
        socialMedia: {
          instagram: '@vignan_ecell',
          linkedin: 'vignan-ecell',
          twitter: '@vignan_ecell'
        },
        budget: {
          allocated: 500000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=E-CELL',
        isActive: true,
        establishedDate: new Date('2015-08-15')
      },
      {
        name: 'SAC (Student Activity Council)',
        code: 'SAC',
        type: 'Cultural',
        university: vignanUniversity._id,
        description: 'Student Activity Council - Coordinating and organizing all cultural, sports, and extracurricular activities across the university campus.',
        objectives: [
          'Organize annual cultural festivals',
          'Coordinate inter-departmental competitions',
          'Manage student clubs and societies',
          'Plan sports tournaments and events',
          'Represent student interests to administration'
        ],
        contactEmail: 'sac@vignanuniversity.org',
        socialMedia: {
          instagram: '@vignan_sac',
          facebook: 'VignanSAC',
          twitter: '@vignan_sac'
        },
        budget: {
          allocated: 1000000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=SAC',
        isActive: true,
        establishedDate: new Date('2010-06-01')
      },
      {
        name: 'NSS (National Service Scheme)',
        code: 'NSS',
        type: 'Social Service',
        university: vignanUniversity._id,
        description: 'National Service Scheme - Dedicated to community service, social welfare, and developing social responsibility among students through various outreach programs.',
        objectives: [
          'Organize community service activities',
          'Conduct rural development programs',
          'Promote social awareness campaigns',
          'Arrange blood donation drives',
          'Participate in disaster relief efforts',
          'Support government welfare schemes'
        ],
        contactEmail: 'nss@vignanuniversity.org',
        socialMedia: {
          instagram: '@vignan_nss',
          facebook: 'VignanNSS'
        },
        budget: {
          allocated: 300000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=NSS',
        isActive: true,
        establishedDate: new Date('2008-09-01')
      },
      {
        name: 'NCC (National Cadet Corps)',
        code: 'NCC',
        type: 'Social Service',
        university: vignanUniversity._id,
        description: 'National Cadet Corps - Training students in discipline, leadership, and character building through structured military training and adventure activities.',
        objectives: [
          'Develop qualities of character, discipline, and leadership',
          'Provide basic military training',
          'Organize adventure activities and camps',
          'Promote national integration and secularism',
          'Instill spirit of patriotism and community service',
          'Prepare youth for armed forces careers'
        ],
        contactEmail: 'ncc@vignanuniversity.org',
        socialMedia: {
          instagram: '@vignan_ncc',
          facebook: 'VignanNCC'
        },
        budget: {
          allocated: 400000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/EF4444/FFFFFF?text=NCC',
        isActive: true,
        establishedDate: new Date('2008-09-01')
      },
      {
        name: 'Alumni Association',
        code: 'ALUMNI',
        type: 'Other',
        university: vignanUniversity._id,
        description: 'Alumni Association - Connecting past and present students, facilitating networking, mentorship, and giving back to the institution through various initiatives.',
        objectives: [
          'Maintain strong alumni network',
          'Organize annual alumni meets',
          'Facilitate mentorship programs',
          'Support current students with career guidance',
          'Raise funds for institutional development',
          'Promote university brand and achievements'
        ],
        contactEmail: 'alumni@vignanuniversity.org',
        socialMedia: {
          linkedin: 'vignan-alumni-association',
          facebook: 'VignanAlumni',
          twitter: '@vignan_alumni'
        },
        budget: {
          allocated: 800000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=ALUMNI',
        isActive: true,
        establishedDate: new Date('2012-01-15')
      },
      {
        name: 'IEEE Student Branch',
        code: 'IEEE',
        type: 'Technical',
        university: vignanUniversity._id,
        description: 'IEEE Student Branch - Institute of Electrical and Electronics Engineers student chapter promoting technical knowledge, innovation, and professional development.',
        objectives: [
          'Organize technical workshops and seminars',
          'Facilitate IEEE certifications',
          'Conduct coding competitions and hackathons',
          'Promote research and innovation',
          'Network with industry professionals',
          'Publish technical papers and projects'
        ],
        contactEmail: 'ieee@vignanuniversity.org',
        socialMedia: {
          instagram: '@vignan_ieee',
          linkedin: 'vignan-ieee',
          website: 'https://ieee-vignan.org'
        },
        budget: {
          allocated: 600000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/0EA5E9/FFFFFF?text=IEEE',
        isActive: true,
        establishedDate: new Date('2014-03-20')
      },
      {
        name: 'Literary Club',
        code: 'LITCLUB',
        type: 'Cultural',
        university: vignanUniversity._id,
        description: 'Literary Club - Nurturing literary talents, promoting creative writing, debate, and public speaking skills among students.',
        objectives: [
          'Organize debate competitions',
          'Conduct creative writing workshops',
          'Host book reading sessions',
          'Arrange guest lectures by authors',
          'Publish student literary magazine',
          'Develop communication and oratory skills'
        ],
        contactEmail: 'litclub@vignanuniversity.org',
        socialMedia: {
          instagram: '@vignan_litclub',
          facebook: 'VignanLiteraryClub'
        },
        budget: {
          allocated: 200000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/EC4899/FFFFFF?text=LIT',
        isActive: true,
        establishedDate: new Date('2016-07-10')
      },
      {
        name: 'Music and Dance Club',
        code: 'MDC',
        type: 'Cultural',
        university: vignanUniversity._id,
        description: 'Music and Dance Club - Platform for students to explore and showcase their talents in various forms of music and dance.',
        objectives: [
          'Organize cultural performances',
          'Conduct music and dance workshops',
          'Participate in inter-college festivals',
          'Arrange musical nights and concerts',
          'Promote traditional and contemporary arts',
          'Provide platform for artistic expression'
        ],
        contactEmail: 'mdc@vignanuniversity.org',
        socialMedia: {
          instagram: '@vignan_mdc',
          youtube: 'VignanMDC',
          facebook: 'VignanMusicDance'
        },
        budget: {
          allocated: 350000,
          spent: 0,
          fiscalYear: '2024-2025'
        },
        logo: 'https://via.placeholder.com/150/F97316/FFFFFF?text=MDC',
        isActive: true,
        establishedDate: new Date('2013-08-25')
      }
    ];

    const createdBodies = await StudentBody.insertMany(studentBodies);
    console.log(`✅ Created ${createdBodies.length} student bodies`);

    console.log('\n🎉 Student Bodies Seeding Complete!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`University: ${vignanUniversity.name} (${vignanUniversity.code})`);
    console.log(`University ID: ${vignanUniversity._id}`);
    console.log(`Student Bodies: ${createdBodies.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📋 Student Bodies Created:');
    createdBodies.forEach((body, index) => {
      console.log(`   ${index + 1}. ${body.name} (${body.code}) - ${body.type}`);
    });

    console.log('\n📝 Type Distribution:');
    const typeCount = {};
    createdBodies.forEach(body => {
      typeCount[body.type] = (typeCount[body.type] || 0) + 1;
    });
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    console.log('\n✨ You can now register Team Reps and Faculty Heads for these student bodies!');
    console.log('   Use these in your registration form dropdown.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

seedStudentBodies();
