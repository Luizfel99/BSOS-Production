/**
 * Test all demo user roles login
 */

const demoUsers = [
  { email: 'admin@bsos.com', password: 'admin123', role: 'ADMIN' },
  { email: 'manager@bsos.com', password: 'demo123', role: 'MANAGER' },
  { email: 'supervisor@bsos.com', password: 'demo123', role: 'SUPERVISOR' },
  { email: 'cleaner@bsos.com', password: 'demo123', role: 'CLEANER' },
  { email: 'owner@bsos.com', password: 'demo123', role: 'OWNER' }
];

async function testLogin(user) {
  try {
    console.log(`\n🔐 Testing ${user.role} (${user.email})...`);
    
    const response = await fetch('http://localhost:3020/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`  ✅ Login successful`);
      console.log(`  👤 User: ${data.user.name}`);
      console.log(`  🎭 Role: ${data.user.role}`);
      console.log(`  📧 Email: ${data.user.email}`);
      return true;
    } else {
      console.log(`  ❌ Login failed: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.log(`  💥 Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing all demo user logins...\n');
  console.log('=' .repeat(60));

  let passed = 0;
  let failed = 0;

  for (const user of demoUsers) {
    const success = await testLogin(user);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed successfully!');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
}

runTests();
