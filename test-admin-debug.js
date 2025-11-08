/**
 * Debug Admin Login Issues
 */

async function debugAdminLogin() {
  console.log('🔍 Debugging Admin Login Flow\n');
  
  try {
    // Step 1: Test Login API
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
    console.log('✅ Login Response:', JSON.stringify(loginData, null, 2));
    
    if (!loginData.success) {
      console.error('❌ Login failed');
      return;
    }
    
    // Step 2: Check role normalization
    console.log('\n2️⃣ Checking role normalization...');
    const roleFromDB = loginData.user.role; // Should be "ADMIN" from database
    const roleNormalized = roleFromDB.toLowerCase(); // Should be "admin"
    
    console.log('   Role from database:', roleFromDB);
    console.log('   Normalized role:', roleNormalized);
    
    // Step 3: Simulate redirect logic from LoginScreen
    console.log('\n3️⃣ Simulating LoginScreen redirect logic...');
    let redirectPath = '/dashboard';
    switch (roleNormalized) {
      case 'cleaner': redirectPath = '/dashboard/cleaner'; break;
      case 'supervisor': redirectPath = '/dashboard/supervisor'; break;
      case 'manager': redirectPath = '/dashboard/manager'; break;
      case 'owner': redirectPath = '/dashboard/owner'; break;
      case 'client': redirectPath = '/dashboard/client'; break;
      case 'admin': redirectPath = '/dashboard'; break;
      default: redirectPath = '/dashboard';
    }
    
    console.log('   Switch matched case:', roleNormalized === 'admin' ? 'admin ✅' : 'default ⚠️');
    console.log('   Redirect path:', redirectPath);
    
    // Step 4: Check if /dashboard route exists
    console.log('\n4️⃣ Checking if /dashboard is accessible...');
    const dashboardResponse = await fetch('http://localhost:3020/dashboard');
    console.log('   Status:', dashboardResponse.status, dashboardResponse.statusText);
    console.log('   Redirect location:', dashboardResponse.headers.get('location'));
    
    // Step 5: Check if /dashboard/admin exists (it shouldn't)
    console.log('\n5️⃣ Checking if /dashboard/admin exists (should be 404)...');
    const adminDashResponse = await fetch('http://localhost:3020/dashboard/admin');
    console.log('   Status:', adminDashResponse.status, adminDashResponse.statusText);
    
    console.log('\n📋 Summary:');
    console.log('   Login works:', loginData.success ? '✅' : '❌');
    console.log('   Role normalized:', roleNormalized === 'admin' ? '✅' : '❌');
    console.log('   Correct redirect path:', redirectPath === '/dashboard' ? '✅' : '❌');
    console.log('   Expected behavior: Admin should redirect to /dashboard');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugAdminLogin();
