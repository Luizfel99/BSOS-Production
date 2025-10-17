const https = require('http');

async function testNotificationsAPI() {
  console.log('🧪 Testing Notifications API...\n');

  // Test data
  const cookies = [
    'bsos-user={"id":"cmgu5he7g000130xb6r8o9ohs","email":"admin@bsos.com","role":"ADMIN"}',
    'bsos-selected-role=ADMIN',
    'auth-token=cmgu5he7g000130xb6r8o9ohs-' + Date.now()
  ].join('; ');

  // Test 1: GET notifications summary
  console.log('1️⃣ Testing GET /api/notifications?summary=true');
  await testEndpoint('GET', '/api/notifications?summary=true', null, cookies);

  // Test 2: GET all notifications
  console.log('\n2️⃣ Testing GET /api/notifications');
  await testEndpoint('GET', '/api/notifications', null, cookies);

  // Test 3: GET unread notifications only
  console.log('\n3️⃣ Testing GET /api/notifications?read=false');
  await testEndpoint('GET', '/api/notifications?read=false', null, cookies);

  // Test 4: Create new notification
  console.log('\n4️⃣ Testing POST /api/notifications (create)');
  const createData = {
    action: 'create',
    title: 'Test Notification',
    message: 'This is a test notification created via API',
    type: 'INFO'
  };
  await testEndpoint('POST', '/api/notifications', createData, cookies);

  // Test 5: Mark all as read
  console.log('\n5️⃣ Testing POST /api/notifications (mark_all_read)');
  const markAllData = { action: 'mark_all_read' };
  await testEndpoint('POST', '/api/notifications', markAllData, cookies);

  console.log('\n✅ API testing completed!');
}

function testEndpoint(method, path, data, cookies) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': cookies
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          console.log('Response:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('Response (non-JSON):', responseData.substring(0, 200) + '...');
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      resolve();
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

testNotificationsAPI();