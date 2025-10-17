const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedNotifications() {
  try {
    console.log('🌱 Seeding notifications...');

    // Get a user to create notifications for
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!user) {
      console.log('❌ No ADMIN user found to create notifications for');
      return;
    }

    console.log('Creating notifications for user:', user.email);

    // Create sample notifications
    const notifications = [
      {
        userId: user.id,
        title: 'Welcome to BSOS Notifications!',
        message: 'Your notification system is now active and ready to use.',
        type: 'SUCCESS'
      },
      {
        userId: user.id,
        title: 'System Update',
        message: 'Phase 7 Notifications Module has been successfully implemented.',
        type: 'INFO'
      },
      {
        userId: user.id,
        title: 'Task Assignment',
        message: 'You have been assigned to review the new notifications system.',
        type: 'TASK_ASSIGNED'
      },
      {
        userId: user.id,
        title: 'Property Update',
        message: 'Property "Sample Location" has been updated with new cleaning instructions.',
        type: 'PROPERTY_UPDATED'
      },
      {
        userId: user.id,
        title: 'Payment Processed',
        message: 'Payment of $299.99 has been successfully processed.',
        type: 'PAYMENT_RECEIVED'
      }
    ];

    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification
      });
      console.log('✅ Created notification:', notification.title);
    }

    console.log('🎉 Successfully seeded notifications!');

    // Display summary
    const total = await prisma.notification.count();
    const unread = await prisma.notification.count({ where: { read: false } });
    
    console.log(`📊 Summary: ${total} total notifications, ${unread} unread`);

  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();