// Test script to verify notifications system
const BASE_URL = 'http://localhost:3001';

async function testNotificationsAPI() {
  console.log('🧪 Testing Notifications API...\n');

  // Test 1: Get all notifications
  console.log('📋 Test 1: GET /api/notifications');
  try {
    const response = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }

  // Test 2: Create a notification
  console.log('📝 Test 2: POST /api/notifications');
  try {
    const testNotification = {
      title: 'Teste Sistema de Notificações',
      message: 'Notification system is working properly in SURGICAL MODE!',
      type: 'SUCCESS'
    };

    const response = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(testNotification)
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log('');
    
    return data.data?.id; // Return notification ID for further tests
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
    return null;
  }
}

async function testIndividualNotification(notificationId) {
  if (!notificationId) return;

  console.log(`🎯 Test 3: PUT /api/notifications/${notificationId}`);
  try {
    const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
      method: 'PUT',
      credentials: 'include'
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }

  console.log(`🗑️ Test 4: DELETE /api/notifications/${notificationId}`);
  try {
    const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }
}

// Run tests
async function runTests() {
  console.log('🚀 SURGICAL MODE - Notifications API Tests');
  console.log('==========================================\n');
  
  const notificationId = await testNotificationsAPI();
  await testIndividualNotification(notificationId);
  
  console.log('🎉 Tests completed!');
  console.log('Navigate to http://localhost:3001/notifications to see the UI');
}

// For Node.js environment
if (typeof window === 'undefined') {
  // Import fetch for Node.js if needed
  const { fetch } = require('cross-fetch');
  runTests();
} else {
  // For browser environment
  runTests();
}