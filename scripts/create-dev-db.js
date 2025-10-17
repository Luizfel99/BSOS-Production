const { PrismaClient } = require('@prisma/client');

async function createDevDatabase() {
  // Connect to default database first to create new one
  const adminUrl = "postgresql://neondb_owner:npg_HVOYn7PcxE1i@ep-autumn-shape-aep7i9x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  
  console.log('🏗️ Creating bsos-dev-branch database...');
  
  try {
    // Note: Neon doesn't allow creating databases via SQL
    // We need to create it through the Neon console
    console.log('ℹ️ Database creation on Neon requires console access');
    console.log('📋 Steps to create bsos-dev-branch:');
    console.log('1. Go to https://console.neon.tech/');
    console.log('2. Select your project');  
    console.log('3. Go to "Databases" tab');
    console.log('4. Click "Create Database"');
    console.log('5. Name it "bsos-dev-branch"');
    console.log('6. Update DATABASE_URL to use the new database name');
    
    // Alternative: Just update the current URL to point to bsos-dev-branch
    console.log('\n🔄 ALTERNATIVE SOLUTION:');
    console.log('Just update the database name in the URL:');
    console.log('From: .../neondb?...');
    console.log('To:   .../bsos-dev-branch?...');
    console.log('\nThen run: npx prisma db push');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createDevDatabase();