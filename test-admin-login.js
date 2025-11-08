/**
 * Test Admin Login Flow
 * Tests the complete login process for admin user with normalized role
 */

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login with Normalized Role\n');

  try {
    // Step 1: Login
    console.log('1️⃣ Testing login API...');
    const loginResponse = await fetch('http://localhost:3020/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bsos.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    
    console.log('Response Status:', loginResponse.status);
    console.log('Success:', loginData.success);
    console.log('User Role:', loginData.user?.role);
    console.log('Expected Role:', 'admin (lowercase)');
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.error);
      return;
    }

    // Check if role is lowercase
    if (loginData.user.role === 'admin') {
      console.log('\n🎉 SUCCESS! Role is correctly normalized to lowercase "admin"');
    } else {
      console.log('\n❌ FAIL! Role is:', loginData.user.role, '(expected: "admin" in lowercase)');
    }

    console.log('\n2️⃣ Full login response:');
    console.log(JSON.stringify(loginData, null, 2));

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testAdminLogin();
