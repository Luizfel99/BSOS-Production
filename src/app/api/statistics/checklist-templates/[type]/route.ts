import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ChecklistWithTask {
  id: string;
  qualityScore: number | null;
  task: {
    scheduledDate: Date;
    estimatedDuration: number | null;
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;
    const { searchParams } = new URL(request.url);
    const periodDays = parseInt(searchParams.get('period') || '30');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get completed checklists for this template type
    const checklists = await prisma.checklist.findMany({
      where: {
        template: {
          type: type
        },
        status: 'COMPLETED',
        completedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        task: {
          select: {
            scheduledDate: true,
            estimatedDuration: true
          }
        }
      }
    });

    // Calculate statistics
    const totalCompleted = checklists.length;
    
    let totalTime = 0;
    let totalApprovalScore = 0;
    let approvedCount = 0;

    checklists.forEach((checklist: ChecklistWithTask) => {
      if (checklist.task.estimatedDuration) {
        totalTime += checklist.task.estimatedDuration;
      }
      
      if (checklist.qualityScore !== null) {
        totalApprovalScore += checklist.qualityScore;
        if (checklist.qualityScore >= 80) { // Considering 80+ as approved
          approvedCount++;
        }
      }
    });

    const averageTime = totalCompleted > 0 ? Math.round(totalTime / totalCompleted) : 0;
    const approvalRate = totalCompleted > 0 ? Math.round((approvedCount / totalCompleted) * 100) : 0;
    const completionRate = 100; // Since we're only looking at completed checklists

    // Calculate comparison with previous period
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - periodDays);
    
    const previousChecklists = await prisma.checklist.count({
      where: {
        template: {
          type: type
        },
        status: 'COMPLETED',
        completedAt: {
          gte: previousStartDate,
          lt: startDate
        }
      }
    });

    const lastWeekComparison = previousChecklists > 0 
      ? Math.round(((totalCompleted - previousChecklists) / previousChecklists) * 100)
      : 0;

    // Store/update statistics record
    await prisma.statistics.upsert({
      where: {
        id: `${type}_${startDate.toISOString()}_${endDate.toISOString()}`
      },
      update: {
        averageTime,
        approvalRate,
        completionRate,
        totalCompleted
      },
      create: {
        templateType: type,
        averageTime,
        approvalRate,
        completionRate,
        totalCompleted,
        periodStart: startDate,
        periodEnd: endDate
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        averageTime,
        approvalRate,
        completionRate,
        totalCompleted,
        lastWeekComparison,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          days: periodDays
        }
      },
      message: 'Statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch statistics' 
      },
      { status: 500 }
    );
  }
}