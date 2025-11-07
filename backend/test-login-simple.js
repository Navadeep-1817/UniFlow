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

async function testLogin(testName, email, password, role) {
  log.section(`TEST: ${testName}`);
  log.data('Email', email);
  log.data('Password', password === process.env.SUPER_ADMIN_KEY ? 'SUPER_ADMIN_KEY from env' : password);
  log.data('Role', role);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
      role
    });
    
    log.success('Login successful!');
    log.data('Token', response.data.token?.substring(0, 30) + '...');
    log.data('User Name', response.data.user?.name || 'N/A');
    log.data('User Role', response.data.user?.role || 'N/A');
    log.data('User Email', response.data.user?.email || 'N/A');
    log.data('Is Active', response.data.user?.isActive || 'N/A');
    log.data('Is Approved', response.data.user?.isApproved || 'N/A');
    
    return { success: true, token: response.data.token, user: response.data.user };
  } catch (error) {
    log.error(`Login failed`);
    log.data('Error', error.response?.data?.message || error.message);
    log.data('Status Code', error.response?.status || 'N/A');
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

async function testProtectedRoute(token, endpoint, routeName) {
  log.info(`\nTesting protected route: ${routeName}`);
  
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    log.success(`${routeName} accessible`);
    log.data('Status', response.status);
    return { success: true };
  } catch (error) {
    log.error(`${routeName} failed`);
    log.data('Error', error.response?.data?.message || error.message);
    return { success: false };
  }
}

async function runTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════════════╗`);
  console.log(`║           UniFlow Login Flow Manual Testing Suite             ║`);
  console.log(`╚════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const results = [];
  
  // Test 1: SuperAdmin login with SUPER_ADMIN_KEY
  const test1 = await testLogin(
    'SuperAdmin Login with SUPER_ADMIN_KEY',
    'superadmin@uniflow.com',
    process.env.SUPER_ADMIN_KEY || 'zorogojo',
    'superadmin'
  );
  results.push({ name: 'SuperAdmin Login', ...test1 });
  
  if (test1.success) {
    // Test protected routes
    await testProtectedRoute(test1.token, '/superadmin/stats', 'GET /api/superadmin/stats');
    await testProtectedRoute(test1.token, '/superadmin/pending-approvals', 'GET /api/superadmin/pending-approvals');
    await testProtectedRoute(test1.token, '/superadmin/users', 'GET /api/superadmin/users');
    await testProtectedRoute(test1.token, '/users/me', 'GET /api/users/me');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2: SuperAdmin login with wrong password
  const test2 = await testLogin(
    'SuperAdmin Login with Wrong Password (Should Fail)',
    'superadmin@uniflow.com',
    'wrongpassword123',
    'superadmin'
  );
  results.push({ name: 'SuperAdmin Wrong Password', ...test2 });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 3: Non-existent user
  const test3 = await testLogin(
    'Non-existent User Login (Should Fail)',
    'nonexistent@test.com',
    'password123',
    'student'
  );
  results.push({ name: 'Non-existent User', ...test3 });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 4: Wrong role for superadmin
  const test4 = await testLogin(
    'SuperAdmin Login with Wrong Role (Should Fail)',
    'superadmin@uniflow.com',
    process.env.SUPER_ADMIN_KEY || 'zorogojo',
    'student'
  );
  results.push({ name: 'SuperAdmin Wrong Role', ...test4 });
  
  // Final Summary
  log.section('TEST SUMMARY');
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach((result, index) => {
    const status = result.success ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
    console.log(`${index + 1}. ${result.name}: ${status}`);
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
  } else {
    log.error('All tests failed. Check server status and configuration.');
  }
}

// Health check first
async function checkServerHealth() {
  log.info('Checking server health...');
  try {
    const response = await axios.get('http://localhost:5000/health');
    log.success('Server is running');
    log.data('Server', response.data.message);
    log.data('Environment', response.data.environment);
    log.data('Database', response.data.database);
    return true;
  } catch (error) {
    log.error('Server is not responding');
    log.error('Please make sure the server is running on port 5000');
    return false;
  }
}

// Main execution
(async () => {
  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    process.exit(1);
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  await runTests();
})().catch(error => {
  log.error(`Test suite crashed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
