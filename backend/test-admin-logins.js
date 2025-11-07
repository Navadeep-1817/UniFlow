const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.blue}${'='.repeat(70)}\n${msg}\n${'='.repeat(70)}${colors.reset}\n`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  data: (label, value) => console.log(`${colors.magenta}   ${label}: ${colors.cyan}${value}${colors.reset}`)
};

// Test users
const testAdmins = {
  superadmin: {
    name: 'SuperAdmin',
    email: 'superadmin@uniflow.com',
    password: process.env.SUPER_ADMIN_KEY || 'zorogojo',
    role: 'superadmin',
    dashboardEndpoint: '/superadmin/stats'
  },
  hod: {
    name: 'HOD (Head of Department)',
    email: 'hod@test.com',
    password: 'HOD@123456',
    role: 'academic_admin_hod',
    dashboardEndpoint: '/academic/dashboard'
  },
  tp: {
    name: 'Training & Placement Head',
    email: 'tp@test.com',
    password: 'TP@123456',
    role: 'academic_admin_tp',
    dashboardEndpoint: '/academic/dashboard'
  },
  sportsHead: {
    name: 'Sports Faculty Head',
    email: 'sportshead@test.com',
    password: 'Sports@123456',
    role: 'non_academic_faculty_head',
    dashboardEndpoint: '/non-academic/dashboard'
  },
  teamRep: {
    name: 'Sports Team Representative',
    email: 'teamrep@test.com',
    password: 'TeamRep@123456',
    role: 'non_academic_team_rep',
    dashboardEndpoint: '/non-academic/dashboard'
  }
};

async function testLogin(adminKey, adminData) {
  log.section(`TEST: ${adminData.name} Login`);
  log.data('Email', adminData.email);
  log.data('Role', adminData.role);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminData.email,
      password: adminData.password,
      role: adminData.role
    });
    
    log.success('Login successful!');
    log.data('Token', response.data.token?.substring(0, 30) + '...');
    log.data('User Name', response.data.user?.name || 'N/A');
    log.data('User Role', response.data.user?.role || 'N/A');
    
    return { 
      success: true, 
      token: response.data.token, 
      user: response.data.user,
      adminKey 
    };
  } catch (error) {
    log.error(`Login failed`);
    log.data('Error', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message, adminKey };
  }
}

async function testDashboard(adminData, token) {
  log.info(`\nTesting dashboard endpoint: ${adminData.dashboardEndpoint}`);
  
  try {
    const response = await axios.get(`${BASE_URL}${adminData.dashboardEndpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    log.success(`Dashboard accessible`);
    log.data('Status', response.status);
    
    if (response.data.data) {
      if (response.data.data.stats) {
        log.info('Dashboard Stats:');
        Object.entries(response.data.data.stats).forEach(([key, value]) => {
          console.log(`      ${key}: ${value}`);
        });
      }
    }
    
    return { success: true };
  } catch (error) {
    log.error(`Dashboard access failed`);
    log.data('Error', error.response?.data?.message || error.message);
    return { success: false };
  }
}

async function testProfile(adminData, token) {
  let profileEndpoint;
  if (adminData.role === 'superadmin') {
    profileEndpoint = '/users/me';
  } else if (adminData.role.includes('academic_admin')) {
    profileEndpoint = '/academic/profile';
  } else if (adminData.role.includes('non_academic')) {
    profileEndpoint = '/non-academic/profile';
  }
      
  log.info(`\nTesting profile endpoint: ${profileEndpoint}`);
  
  try {
    const response = await axios.get(`${BASE_URL}${profileEndpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    log.success(`Profile accessible`);
    log.data('Status', response.status);
    return { success: true };
  } catch (error) {
    log.error(`Profile access failed`);
    log.data('Error', error.response?.data?.message || error.message);
    return { success: false };
  }
}

async function testPermissions(adminData, token) {
  if (adminData.role === 'superadmin') {
    log.info(`\nSkipping permissions check for SuperAdmin (full access)`);
    return { success: true, skipped: true };
  }
  
  let permissionsEndpoint;
  if (adminData.role.includes('academic_admin')) {
    permissionsEndpoint = '/academic/permissions';
  } else if (adminData.role.includes('non_academic')) {
    permissionsEndpoint = '/non-academic/permissions';
  }
    
  log.info(`\nTesting permissions endpoint: ${permissionsEndpoint}`);
  
  try {
    const response = await axios.get(`${BASE_URL}${permissionsEndpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    log.success(`Permissions accessible`);
    log.data('Admin Type', response.data.data?.adminType || 'N/A');
    
    if (response.data.data?.permissions) {
      log.info('Permissions:');
      Object.entries(response.data.data.permissions).forEach(([key, value]) => {
        console.log(`      ${key}: ${value}`);
      });
    }
    
    return { success: true };
  } catch (error) {
    log.error(`Permissions access failed`);
    log.data('Error', error.response?.data?.message || error.message);
    return { success: false };
  }
}

async function runAllTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════════════╗`);
  console.log(`║        UniFlow Admin Login Flow Comprehensive Testing         ║`);
  console.log(`╚════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Check server health
  log.info('Checking server health...');
  try {
    await axios.get('http://localhost:5000/health');
    log.success('Server is running\n');
  } catch (error) {
    log.error('Server is not responding');
    log.error('Please make sure the server is running on port 5000');
    process.exit(1);
  }
  
  const results = [];
  const loginResults = [];
  
  // Test each admin login
  for (const [key, adminData] of Object.entries(testAdmins)) {
    const loginResult = await testLogin(key, adminData);
    loginResults.push(loginResult);
    results.push({ 
      name: `${adminData.name} - Login`, 
      success: loginResult.success 
    });
    
    if (loginResult.success) {
      // Test dashboard
      const dashResult = await testDashboard(adminData, loginResult.token);
      results.push({ 
        name: `${adminData.name} - Dashboard`, 
        success: dashResult.success 
      });
      
      // Test profile
      const profileResult = await testProfile(adminData, loginResult.token);
      results.push({ 
        name: `${adminData.name} - Profile`, 
        success: profileResult.success 
      });
      
      // Test permissions
      const permResult = await testPermissions(adminData, loginResult.token);
      results.push({ 
        name: `${adminData.name} - Permissions`, 
        success: permResult.success 
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Final Summary
  log.section('TEST SUMMARY');
  
  console.log(`${colors.blue}Login Results:${colors.reset}`);
  loginResults.forEach((result, index) => {
    const admin = Object.values(testAdmins)[index];
    const status = result.success ? `${colors.green}✅ PASS${colors.reset}` : `${colors.red}❌ FAIL${colors.reset}`;
    console.log(`  ${index + 1}. ${admin.name}: ${status}`);
    if (!result.success) {
      console.log(`     ${colors.red}Error: ${result.error}${colors.reset}`);
    }
  });
  
  console.log(`\n${colors.blue}Overall Results:${colors.reset}`);
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach((result, index) => {
    const status = result.success ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
    console.log(`  ${index + 1}. ${result.name}: ${status}`);
  });
  
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`Total Tests: ${results.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`${colors.cyan}Success Rate: ${((passed / results.length) * 100).toFixed(1)}%${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  if (passed === results.length) {
    log.success('All tests passed! 🎉');
  } else if (passed > 0) {
    log.warn(`${passed} out of ${results.length} tests passed`);
    log.warn('Run seed-admin-users.js if admin users are not created yet');
  } else {
    log.error('All tests failed. Check server status and run seed-admin-users.js');
  }
}

runAllTests().catch(error => {
  log.error(`Test suite crashed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
