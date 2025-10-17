const https = require('http');

// Simulate authenticated request with cookies
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/finance',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': [
      'bsos-user={"id":"cmgu5he7g000130xb6r8o9ohs","email":"admin@bsos.com","role":"ADMIN"}',
      'bsos-selected-role=ADMIN',
      'auth-token=cmgu5he7g000130xb6r8o9ohs-' + Date.now()
    ].join('; ')
  }
};

console.log('Testing Finance API with authentication...');
console.log('Headers:', options.headers);

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n=== RESPONSE ===');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response is not JSON:');
      console.log(data.substring(0, 500) + '...');
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.end();