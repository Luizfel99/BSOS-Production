import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  withErrorHandling, 
  createSuccessResponse, 
  createErrorResponse,
  validateRequiredFields 
} from '@/lib/api-utils';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const assignedTo = searchParams.get('assignedTo');
  const propertyId = searchParams.get('propertyId');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const date = searchParams.get('date');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  // Build dynamic where clause
  const where: any = {};
  
  if (assignedTo) {
    where.assignedTo = assignedTo;
  }
  
  if (propertyId) {
    where.propertyId = propertyId;
  }
  
  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (type) {
    where.type = type;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (date) {
    const dateStart = new Date(date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);
    
    where.dueDate = {
      gte: dateStart,
      lt: dateEnd
    };
  }

  // Get tasks with total count for pagination
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        assignedToUser: {
          select: { id: true, name: true, email: true }
        },
        property: {
          select: { id: true, name: true, address: true }
        },
        notes: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: [
        { dueDate: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    }),
    prisma.task.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  return createSuccessResponse({
    tasks: tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedToUser?.id,
      assignedToName: task.assignedToUser?.name,
      propertyId: task.property?.id,
      propertyName: task.property?.name,
      dueDate: task.dueDate?.toISOString(),
      estimatedDuration: task.estimatedDuration,
      materials: task.materials,
      instructions: task.instructions,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    })),
    total,
    page,
    limit,
    totalPages
  });
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  
  // Validate required fields
  const validation = validateRequiredFields(body, ['title', 'type', 'priority']);
  if (validation) return validation;

  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      type: body.type,
      priority: body.priority,
      status: body.status || 'pending',
      assignedTo: body.assignedTo,
      propertyId: body.propertyId,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      estimatedDuration: body.estimatedDuration,
      materials: body.materials,
      instructions: body.instructions
    },
    include: {
      assignedToUser: {
        select: { id: true, name: true, email: true }
      },
      property: {
        select: { id: true, name: true, address: true }
      }
    }
  });

  return createSuccessResponse({
    id: task.id,
    title: task.title,
    description: task.description,
    type: task.type,
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedToUser?.id,
    assignedToName: task.assignedToUser?.name,
    propertyId: task.property?.id,
    propertyName: task.property?.name,
    dueDate: task.dueDate?.toISOString(),
    estimatedDuration: task.estimatedDuration,
    materials: task.materials,
    instructions: task.instructions,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  }, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('id');
  
  if (!taskId) {
    return createErrorResponse('Task ID is required', 400);
  }

  const body = await request.json();
  
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.priority && { priority: body.priority }),
      ...(body.estimatedDuration && { estimatedDuration: body.estimatedDuration }),
      ...(body.scheduledDate && { scheduledDate: new Date(body.scheduledDate) }),
      ...(body.type && { type: body.type }),
      updatedAt: new Date()
    },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true, role: true }
      },
      property: {
        select: { id: true, name: true, address: true, type: true }
      }
    }
  });

  return createSuccessResponse(task);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('id');
  
  if (!taskId) {
    return createErrorResponse('Task ID is required', 400);
  }

  await prisma.task.delete({
    where: { id: taskId }
  });

  return createSuccessResponse({ message: 'Task deleted successfully' });
});
