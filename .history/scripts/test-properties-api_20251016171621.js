const http = require('http');

function testPropertiesAPI() {
  console.log('🧪 Testando API Properties...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/properties',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Response:', JSON.stringify(response, null, 2));
        
        if (response.success && response.data) {
          console.log(`🏠 Properties found: ${response.data.length}`);
          response.data.forEach((prop, index) => {
            console.log(`${index + 1}. ${prop.name} (${prop.type}) - ${prop.clientName}`);
          });
        }
      } catch (error) {
        console.log('❌ Raw response:', data);
        console.error('💥 Parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('🚫 Request error:', error.message);
  });

  req.end();
}

testPropertiesAPI();