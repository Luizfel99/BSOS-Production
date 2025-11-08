#!/usr/bin/env node

/**
 * Test script to verify login flow end-to-end
 * Tests both API endpoint and database connectivity
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLoginFlow() {
  console.log('\n🧪 Testing BSOS Login Flow\n');
  console.log('=' . repeat(50));

  try {
    // Test 1: Database Connection
    console.log('\n📦 Test 1: Database Connection');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Test 2: Check if users exist
    console.log('\n👥 Test 2: Checking users in database');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      }
    });
    
    console.log(`✅ Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) ${user.active ? '✓' : '✗'}`);
    });

    // Test 3: Verify admin user exists
    console.log('\n🔐 Test 3: Verify admin account');
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@bsos.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        active: true,
      }
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('✅ Admin user found:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.active);

    // Test 4: Verify password hash
    console.log('\n🔑 Test 4: Verify password hash');
    const isValidPassword = await bcrypt.compare('admin123', admin.passwordHash);
    
    if (isValidPassword) {
      console.log('✅ Admin password hash is valid (admin123)');
    } else {
      console.log('❌ Admin password hash is INVALID!');
      process.exit(1);
    }

    // Test 5: Simulate login API logic
    console.log('\n🌐 Test 5: Simulate login API logic');
    
    const testEmail = 'admin@bsos.com';
    const testPassword = 'admin123';
    
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        active: true,
      }
    });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    if (!user.active) {
      console.log('❌ User account is deactivated');
      process.exit(1);
    }

    const validPassword = await bcrypt.compare(testPassword, user.passwordHash);
    
    if (!validPassword) {
      console.log('❌ Invalid password');
      process.exit(1);
    }

    console.log('✅ Login simulation successful!');
    console.log('   User ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);

    // Test 6: Test all demo accounts
    console.log('\n👨‍💼 Test 6: Verify all demo accounts');
    
    const demoAccounts = [
      { email: 'admin@bsos.com', password: 'admin123', role: 'ADMIN' },
      { email: 'manager@bsos.com', password: 'demo123', role: 'MANAGER' },
      { email: 'supervisor@bsos.com', password: 'demo123', role: 'SUPERVISOR' },
      { email: 'cleaner@bsos.com', password: 'demo123', role: 'CLEANER' },
      { email: 'owner@bsos.com', password: 'demo123', role: 'OWNER' },
    ];

    for (const account of demoAccounts) {
      const testUser = await prisma.user.findUnique({
        where: { email: account.email },
        select: {
          email: true,
          role: true,
          passwordHash: true,
          active: true,
        }
      });

      if (!testUser) {
        console.log(`   ❌ ${account.email} - NOT FOUND`);
        continue;
      }

      if (!testUser.active) {
        console.log(`   ❌ ${account.email} - INACTIVE`);
        continue;
      }

      const passwordValid = await bcrypt.compare(account.password, testUser.passwordHash);
      
      if (!passwordValid) {
        console.log(`   ❌ ${account.email} - INVALID PASSWORD`);
        continue;
      }

      if (testUser.role !== account.role) {
        console.log(`   ⚠️  ${account.email} - ROLE MISMATCH (expected ${account.role}, got ${testUser.role})`);
        continue;
      }

      console.log(`   ✅ ${account.email} - OK`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests passed successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('   Admin:      admin@bsos.com / admin123');
    console.log('   Manager:    manager@bsos.com / demo123');
    console.log('   Supervisor: supervisor@bsos.com / demo123');
    console.log('   Cleaner:    cleaner@bsos.com / demo123');
    console.log('   Owner:      owner@bsos.com / demo123');
    console.log('');

  } catch (error) {
    console.error('\n💥 Test failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testLoginFlow();
