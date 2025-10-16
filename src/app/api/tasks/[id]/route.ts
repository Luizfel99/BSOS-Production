import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  withErrorHandling, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/lib/api-utils';

export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const taskId = params.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
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
    }
  });

  if (!task) {
    return createErrorResponse('Task not found', 404);
  }

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
    updatedAt: task.updatedAt.toISOString(),
    notes: task.notes
  });
});

export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const taskId = params.id;
  const body = await request.json();

  // Check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!existingTask) {
    return createErrorResponse('Task not found', 404);
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.type && { type: body.type }),
      ...(body.priority && { priority: body.priority }),
      ...(body.status && { status: body.status }),
      ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
      ...(body.propertyId !== undefined && { propertyId: body.propertyId }),
      ...(body.dueDate !== undefined && { 
        dueDate: body.dueDate ? new Date(body.dueDate) : null 
      }),
      ...(body.estimatedDuration !== undefined && { estimatedDuration: body.estimatedDuration }),
      ...(body.materials !== undefined && { materials: body.materials }),
      ...(body.instructions !== undefined && { instructions: body.instructions }),
      updatedAt: new Date()
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
  });
});

export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const taskId = params.id;

  // Check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!existingTask) {
    return createErrorResponse('Task not found', 404);
  }

  await prisma.task.delete({
    where: { id: taskId }
  });

  return createSuccessResponse({ 
    message: 'Task deleted successfully' 
  });
});