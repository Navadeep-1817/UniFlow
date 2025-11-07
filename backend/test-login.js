const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

// Test data for each role
const testUsers = {
  superadmin: {
    email: 'superadmin@uniflow.com',
    password: process.env.SUPER_ADMIN_KEY || 'zorogojo',
    role: 'superadmin'
  },
  student: {
    email: 'student@test.com',
    password: 'Student@123',
    role: 'student',
    name: 'Test Student',
    phone: '1234567890'
  },
  faculty: {
    email: 'faculty@test.com',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Test Faculty',
    phone: '1234567891'
  },
  hod: {
    email: 'hod@test.com',
    password: 'HOD@123',
    role: 'academic_admin_hod',
    name: 'Test HOD',
    phone: '1234567892'
  },
  placementHead: {
    email: 'placement@test.com',
    password: 'Placement@123',
    role: 'academic_admin_tp',
    name: 'Test Placement Head',
    phone: '1234567893'
  },
  sportsHead: {
    email: 'sports@test.com',
    password: 'Sports@123',
    role: 'non_academic_faculty_head',
    name: 'Test Sports Head',
    phone: '1234567894'
  },
  teamRep: {
    email: 'teamrep@test.com',
    password: 'TeamRep@123',
    role: 'non_academic_team_rep',
    name: 'Test Team Rep',
    phone: '1234567895'
  }
};

// Helper function to register a user
async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

// Helper function to login a user
async function loginUser(email, password, role) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
      role
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

// Test superadmin login with SUPER_ADMIN_KEY
async function testSuperAdminLogin() {
  log.section('TEST 1: SuperAdmin Login with SUPER_ADMIN_KEY');
  
  const { email, password, role } = testUsers.superadmin;
  
  log.info(`Attempting SuperAdmin login...`);
  log.info(`Email: ${email}`);
  log.info(`Using SUPER_ADMIN_KEY from env: ${password}`);
  
  const result = await loginUser(email, password, role);
  
  if (result.success) {
    log.success('SuperAdmin login successful!');
    log.info(`Token: ${result.data.token?.substring(0, 20)}...`);
    log.info(`User: ${result.data.user?.name || 'N/A'}`);
    log.info(`Role: ${result.data.user?.role || 'N/A'}`);
    return { success: true, token: result.data.token };
  } else {
    log.error(`SuperAdmin login failed: ${result.error}`);
    log.warn('Note: SuperAdmin user may not exist in DB yet');
    return { success: false };
  }
}

// Test registration and login for other roles
async function testRoleRegistrationAndLogin(roleName, userData) {
  log.section(`TEST: ${roleName.toUpperCase()} - Registration & Login`);
  
  // Step 1: Register
  log.info(`Step 1: Registering ${roleName}...`);
  const registerResult = await registerUser(userData);
  
  if (registerResult.success) {
    log.success(`${roleName} registered successfully!`);
    log.info(`User ID: ${registerResult.data.user?._id || 'N/A'}`);
    log.info(`Email: ${registerResult.data.user?.email || userData.email}`);
    log.info(`Status: Pending approval`);
  } else {
    if (registerResult.error.includes('already exists')) {
      log.warn(`${roleName} already exists, skipping registration`);
    } else {
      log.error(`${roleName} registration failed: ${registerResult.error}`);
      return { success: false };
    }
  }
  
  // Step 2: Attempt login (should fail - pending approval)
  log.info(`\nStep 2: Attempting login (should fail - pending approval)...`);
  const loginResult1 = await loginUser(userData.email, userData.password, userData.role);
  
  if (!loginResult1.success) {
    if (loginResult1.error.includes('pending approval') || loginResult1.error.includes('not approved')) {
      log.success(`Expected failure: ${loginResult1.error}`);
    } else {
      log.warn(`Login failed with different reason: ${loginResult1.error}`);
    }
  } else {
    log.warn('Unexpected: Login succeeded before approval!');
  }
  
  return { 
    success: true, 
    email: userData.email,
    password: userData.password,
    role: userData.role,
    needsApproval: true
  };
}

// Test login after approval
async function testLoginAfterApproval(email, password, role, token) {
  log.info(`\nAttempting login after approval...`);
  const loginResult = await loginUser(email, password, role);
  
  if (loginResult.success) {
    log.success(`${role} login successful after approval!`);
    log.info(`Token: ${loginResult.data.token?.substring(0, 20)}...`);
    return { success: true, token: loginResult.data.token };
  } else {
    log.error(`${role} login failed: ${loginResult.error}`);
    return { success: false };
  }
}

// Approve a user (requires superadmin token)
async function approveUser(userId, superAdminToken) {
  try {
    const response = await axios.post(
      `${BASE_URL}/superadmin/approve/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${superAdminToken}` }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

// Get pending approvals (requires superadmin token)
async function getPendingApprovals(superAdminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/superadmin/pending-approvals`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

// Main test runner
async function runAllTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗`);
  console.log(`║           UniFlow Login Flow Testing Suite              ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    pendingUsers: []
  };
  
  // Test 1: SuperAdmin login
  results.total++;
  const superAdminResult = await testSuperAdminLogin();
  if (superAdminResult.success) {
    results.passed++;
  } else {
    results.failed++;
    log.warn('Continuing with other tests...\n');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2-7: Register and test login for other roles
  const rolesToTest = ['student', 'faculty', 'hod', 'placementHead', 'sportsHead', 'teamRep'];
  
  for (const roleKey of rolesToTest) {
    results.total++;
    const result = await testRoleRegistrationAndLogin(roleKey, testUsers[roleKey]);
    if (result.success) {
      results.passed++;
      if (result.needsApproval) {
        results.pendingUsers.push(result);
      }
    } else {
      results.failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test 8: If superadmin login worked, approve users and test their login
  if (superAdminResult.success && results.pendingUsers.length > 0) {
    log.section('TEST: Approve Users and Test Login After Approval');
    
    // Get pending approvals
    log.info('Fetching pending approvals...');
    const pendingResult = await getPendingApprovals(superAdminResult.token);
    
    if (pendingResult.success && pendingResult.data.data) {
      const pendingUsers = pendingResult.data.data;
      log.success(`Found ${pendingUsers.length} pending approval(s)`);
      
      // Approve each user
      for (const user of pendingUsers) {
        log.info(`\nApproving ${user.name} (${user.email})...`);
        const approveResult = await approveUser(user._id, superAdminResult.token);
        
        if (approveResult.success) {
          log.success(`${user.name} approved successfully!`);
          
          // Find matching test user data
          const testUser = results.pendingUsers.find(u => u.email === user.email);
          if (testUser) {
            results.total++;
            const loginResult = await testLoginAfterApproval(
              testUser.email,
              testUser.password,
              testUser.role,
              superAdminResult.token
            );
            if (loginResult.success) {
              results.passed++;
            } else {
              results.failed++;
            }
          }
        } else {
          log.error(`Failed to approve ${user.name}: ${approveResult.error}`);
          results.total++;
          results.failed++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else {
      log.warn('Could not fetch pending approvals');
    }
  }
  
  // Final summary
  log.section('TEST SUMMARY');
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);
  
  if (results.failed === 0) {
    log.success('All tests passed! 🎉');
  } else {
    log.warn(`Some tests failed. Check the output above for details.`);
  }
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
