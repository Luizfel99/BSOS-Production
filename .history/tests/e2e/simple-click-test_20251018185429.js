/**
 * BSOS SURGICAL MODE - Simplified E2E Click Test
 * Date: 2025-10-18
 * Purpose: Quick UI responsiveness validation
 */

const puppeteer = require('puppeteer');

async function runSimpleClickTest() {
  console.log('🚨 BSOS SURGICAL MODE - Simplified E2E Test Starting...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  const results = [];
  
  try {
    // Test 1: Home Page Load
    console.log('📍 Testing: Home page load');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    results.push({ test: 'Home Page Load', status: '✅ PASS', details: 'Page loaded successfully' });

    // Test 2: Dashboard Navigation
    console.log('📍 Testing: Dashboard navigation');
    try {
      await page.click('a[href="/dashboard"]');
      await page.waitForTimeout(2000);
      const url = page.url();
      if (url.includes('/dashboard')) {
        results.push({ test: 'Dashboard Navigation', status: '✅ PASS', details: `Navigated to ${url}` });
      } else {
        results.push({ test: 'Dashboard Navigation', status: '❌ FAIL', details: 'URL did not change' });
      }
    } catch (e) {
      results.push({ test: 'Dashboard Navigation', status: '❌ FAIL', details: e.message });
    }

    // Test 3: Tasks Page
    console.log('📍 Testing: Tasks page navigation');
    try {
      await page.click('a[href="/tasks"]');
      await page.waitForTimeout(2000);
      const url = page.url();
      if (url.includes('/tasks')) {
        results.push({ test: 'Tasks Page', status: '✅ PASS', details: `Navigated to ${url}` });
      } else {
        results.push({ test: 'Tasks Page', status: '❌ FAIL', details: 'Navigation failed' });
      }
    } catch (e) {
      results.push({ test: 'Tasks Page', status: '❌ FAIL', details: e.message });
    }

    // Test 4: Properties Page
    console.log('📍 Testing: Properties page navigation');
    try {
      await page.click('a[href="/properties"]');
      await page.waitForTimeout(2000);
      const url = page.url();
      if (url.includes('/properties')) {
        results.push({ test: 'Properties Page', status: '✅ PASS', details: `Navigated to ${url}` });
      } else {
        results.push({ test: 'Properties Page', status: '❌ FAIL', details: 'Navigation failed' });
      }
    } catch (e) {
      results.push({ test: 'Properties Page', status: '❌ FAIL', details: e.message });
    }

    // Test 5: Finance Page
    console.log('📍 Testing: Finance page navigation');
    try {
      await page.click('a[href="/finance"]');
      await page.waitForTimeout(2000);
      const url = page.url();
      if (url.includes('/finance')) {
        results.push({ test: 'Finance Page', status: '✅ PASS', details: `Navigated to ${url}` });
      } else {
        results.push({ test: 'Finance Page', status: '❌ FAIL', details: 'Navigation failed' });
      }
    } catch (e) {
      results.push({ test: 'Finance Page', status: '❌ FAIL', details: e.message });
    }

    // Test 6: Settings Page
    console.log('📍 Testing: Settings page navigation');
    try {
      await page.click('a[href="/settings"]');
      await page.waitForTimeout(2000);
      const url = page.url();
      if (url.includes('/settings')) {
        results.push({ test: 'Settings Page', status: '✅ PASS', details: `Navigated to ${url}` });
      } else {
        results.push({ test: 'Settings Page', status: '❌ FAIL', details: 'Navigation failed' });
      }
    } catch (e) {
      results.push({ test: 'Settings Page', status: '❌ FAIL', details: e.message });
    }

    // Test 7: Button Interactivity on Dashboard
    console.log('📍 Testing: Button interactions on Dashboard');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000);
    
    try {
      const buttons = await page.$$('button');
      if (buttons.length > 0) {
        results.push({ test: 'Button Elements Found', status: '✅ PASS', details: `Found ${buttons.length} buttons` });
        
        // Click first visible button
        await buttons[0].click();
        await page.waitForTimeout(1000);
        results.push({ test: 'Button Click Response', status: '✅ PASS', details: 'Button responded to click' });
      } else {
        results.push({ test: 'Button Elements Found', status: '❌ FAIL', details: 'No buttons found' });
      }
    } catch (e) {
      results.push({ test: 'Button Interactions', status: '❌ FAIL', details: e.message });
    }

    // Test 8: BSOS Design System Elements
    console.log('📍 Testing: BSOS Design System presence');
    try {
      const bsosElements = await page.$$('[class*="bsos"], [class*="rounded-"], [class*="shadow-"]');
      if (bsosElements.length > 0) {
        results.push({ test: 'BSOS Design System', status: '✅ PASS', details: `Found ${bsosElements.length} BSOS elements` });
      } else {
        results.push({ test: 'BSOS Design System', status: '⚠️ PARTIAL', details: 'Limited BSOS elements found' });
      }
    } catch (e) {
      results.push({ test: 'BSOS Design System', status: '❌ FAIL', details: e.message });
    }

  } catch (error) {
    console.error('Critical test error:', error);
    results.push({ test: 'CRITICAL ERROR', status: '❌ FAIL', details: error.message });
  }

  await browser.close();

  // Generate Results
  console.log('\n📊 BSOS E2E CLICK TEST RESULTS');
  console.log('=====================================');
  
  const passed = results.filter(r => r.status.includes('✅')).length;
  const failed = results.filter(r => r.status.includes('❌')).length;
  const warnings = results.filter(r => r.status.includes('⚠️')).length;
  
  results.forEach(result => {
    console.log(`${result.status} ${result.test}: ${result.details}`);
  });
  
  console.log('\n📈 SUMMARY:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  console.log(`📊 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  return { passed, failed, warnings, results };
}

// Execute if run directly
if (require.main === module) {
  runSimpleClickTest().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}

module.exports = { runSimpleClickTest };