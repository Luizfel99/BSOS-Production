// Simple test script to verify settings API
async function testSettingsAPI() {
  console.log('🧪 Testing Settings API...');
  
  try {
    // Test GET settings
    console.log('\n📥 Testing GET /api/settings');
    const getResponse = await fetch('http://localhost:3001/api/settings');
    const getData = await getResponse.json();
    
    if (getResponse.ok) {
      console.log('✅ GET request successful');
      console.log('📊 Settings data:', JSON.stringify(getData, null, 2));
    } else {
      console.log('❌ GET request failed:', getData);
    }

    // Test PUT settings (update)
    console.log('\n📤 Testing PUT /api/settings');
    const putResponse = await fetch('http://localhost:3001/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: 'general',
        key: 'company_name',
        value: 'BSOS Cleaning Management - Updated',
        type: 'STRING'
      })
    });
    
    const putData = await putResponse.json();
    
    if (putResponse.ok) {
      console.log('✅ PUT request successful');
      console.log('📝 Updated setting:', JSON.stringify(putData, null, 2));
    } else {
      console.log('❌ PUT request failed:', putData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSettingsAPI();