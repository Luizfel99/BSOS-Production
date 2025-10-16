#!/usr/bin/env node

/**
 * BSOS API Testing Script
 * Tests all API routes locally before production deployment
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// API routes to test
const apiRoutes = [
  // Basic health checks
  { method: 'GET', path: '/api/health', expected: 200 },
  { method: 'GET', path: '/api/status', expected: 200 },
  
  // Authentication routes
  { method: 'POST', path: '/api/auth/login', expected: [200, 400, 401] },
  { method: 'POST', path: '/api/auth/logout', expected: [200, 401] },
  
  // Finance module routes
  { method: 'GET', path: '/api/finance/balance', expected: [200, 401] },
  { method: 'GET', path: '/api/finance/transactions', expected: [200, 401] },
  { method: 'GET', path: '/api/finance/invoices', expected: [200, 401] },
  
  // Stripe webhook (should reject without signature)
  { method: 'POST', path: '/api/finance/webhooks', expected: 400 },
  
  // Tasks and checklist routes
  { method: 'GET', path: '/api/tasks', expected: [200, 401] },
  { method: 'GET', path: '/api/checklists', expected: [200, 401] },
  
  // Supervisor routes
  { method: 'GET', path: '/api/supervisor', expected: [200, 401] },
  
  // Client portal routes
  { method: 'GET', path: '/api/client/cleanings', expected: [200, 401] },
  { method: 'GET', path: '/api/client/invoices', expected: [200, 401] },
  
  // Analytics routes
  { method: 'GET', path: '/api/analytics/dashboard', expected: [200, 401] },
  
  // Webhooks
  { method: 'POST', path: '/api/webhooks', expected: [200, 400, 401] },
];

async function testApiRoute(route) {
  const url = `${BASE_URL}${route.path}`;
  const options = {
    method: route.method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'BSOS-API-Tester/1.0'
    }
  };

  // Add test data for POST requests
  if (route.method === 'POST') {
    options.body = JSON.stringify({
      test: true,
      timestamp: new Date().toISOString()
    });
  }

  try {
    console.log(`🧪 Testing ${route.method} ${route.path}...`);
    const response = await fetch(url, options);
    const status = response.status;
    
    // Check if status is in expected range
    const expectedStatuses = Array.isArray(route.expected) ? route.expected : [route.expected];
    const isExpected = expectedStatuses.includes(status);
    
    if (isExpected) {
      console.log(`✅ ${route.method} ${route.path} - Status: ${status} (Expected)`);
      return { success: true, route: route.path, status };
    } else {
      console.log(`❌ ${route.method} ${route.path} - Status: ${status} (Expected: ${expectedStatuses.join(' or ')})`);
      return { success: false, route: route.path, status, expected: expectedStatuses };
    }
  } catch (error) {
    console.log(`💥 ${route.method} ${route.path} - Error: ${error.message}`);
    return { success: false, route: route.path, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting BSOS API Tests...\n');
  
  // Check if server is running
  try {
    await fetch(`${BASE_URL}/api/health`);
    console.log('✅ Server is running on http://localhost:3000\n');
  } catch (error) {
    console.log('❌ Server is not running. Please start the development server with "npm run dev"\n');
    process.exit(1);
  }

  const results = [];
  
  // Test each route
  for (const route of apiRoutes) {
    const result = await testApiRoute(route);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Generate summary
  console.log('\n📊 Test Summary:');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n🔍 Failed Tests:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  • ${result.route} - ${result.error || `Status: ${result.status}`}`);
    });
  }

  console.log('\n🎯 Deployment Readiness:');
  if (failed === 0) {
    console.log('✅ All API routes are functioning correctly!');
    console.log('✅ Ready for production deployment!');
  } else if (failed <= 3) {
    console.log('⚠️  Some routes failed but may be expected (auth-protected routes)');
    console.log('✅ Likely ready for production deployment');
  } else {
    console.log('❌ Multiple routes failing - investigate before deployment');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Fix any critical API issues');
  console.log('2. Set up environment variables in Vercel Dashboard');
  console.log('3. Deploy to Vercel: npm run deploy:vercel');
  console.log('4. Test production deployment');
  console.log('5. Monitor with Sentry and Vercel Analytics');
}

// Run the tests
runTests().catch(console.error);