import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../../../lib/database';

// Consolidated GET handler: verifies JWT (if present) and returns dashboard data
export async function GET(request: NextRequest) {
  try {
    // Auth header may be either 'authorization' or 'Authorization'
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

    let user: any = null;
    if (authHeader) {
      const parts = authHeader.split(' ');
      const token = parts.length === 2 ? parts[1] : parts[0];
      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (e) {
          console.warn('[dashboard] JWT verification failed:', (e as any)?.message ?? e);
          // Treat as unauthorized
          return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }
      }
    }

    // Use safe optional chaining when db methods may not exist in simple test environments
    const stats = typeof db.getDashboardStats === 'function' ? db.getDashboardStats() : { tasksToday: 0, lowStockAlerts: 0, activeProperties: 0, connectedIntegrations: 0 };
    const tasksToday = typeof db.getTasksForToday === 'function' ? db.getTasksForToday() : [];
    const lowStockItems = typeof db.getLowStockItems === 'function' ? db.getLowStockItems() : [];
    const properties = typeof db.getProperties === 'function' ? db.getProperties() : [];
  const users = (typeof db.getUsers === 'function' ? db.getUsers() : []).filter((u: any) => u.role?.toLowerCase() === 'cleaner' && u.active);

    const totalRevenue = (typeof db.getReservations === 'function' ? db.getReservations() : [])
      .filter((r: any) => r.status === 'confirmed')
      .reduce((total: number, r: any) => total + (r.totalValue || 0), 0);

    const completedTasksToday = tasksToday.filter((t: any) => t.status === 'completed').length;
    const inProgressTasksList = tasksToday.filter((t: any) => t.status === 'in_progress');

    const cleanerPerformance = users.map((cleaner: any) => {
      const cleanerTasks = typeof db.getTasksByCleaner === 'function' ? db.getTasksByCleaner(cleaner.id) : [];
      const completedTasks = cleanerTasks.filter((t: any) => t.status === 'completed');
      const avgRating = completedTasks.length > 0
        ? completedTasks.reduce((sum: number, t: any) => sum + (t.rating || 0), 0) / completedTasks.length
        : 0;

      return {
        id: cleaner.id,
        name: cleaner.name,
        tasksToday: cleanerTasks.filter((t: any) => t.scheduledDate === new Date().toISOString().split('T')[0]).length,
        completedTasks: completedTasks.length,
        avgRating: Number(avgRating).toFixed(1),
        status: inProgressTasksList.some((t: any) => t.assignedCleanerId === cleaner.id) ? 'Em Serviço' : 'Disponível'
      };
    });

    const today = new Date();
    const nextEvents = (typeof db.getReservations === 'function' ? db.getReservations() : [])
      .filter((r: any) => r.status === 'confirmed')
      .map((r: any) => ({
        type: new Date(r.checkIn) > today ? 'checkin' : 'checkout',
        time: new Date(r.checkIn) > today ? r.checkIn : r.checkOut,
        property: properties.find((p: any) => p.id === r.propertyId)?.name || 'Propriedade',
        guest: r.guestName,
        status: 'pending'
      }))
      .sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        tasksToday: stats.tasksToday,
        completedToday: completedTasksToday,
        inProgress: inProgressTasksList.length,
        lowStockAlerts: stats.lowStockAlerts,
        activeProperties: stats.activeProperties,
        totalRevenue: totalRevenue,
        connectedIntegrations: stats.connectedIntegrations
      },
      cleanerPerformance,
      nextEvents,
      lowStockItems: lowStockItems.map((item: any) => ({
        name: item.name,
        currentStock: item.currentStock,
        minStock: item.minStock,
        unit: item.unit
      })),
      recentActivity: [
        {
          id: 1,
          type: 'task_completed',
          message: 'Maria Silva completou limpeza no Apartamento Centro',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          priority: 'success'
        },
        {
          id: 2,
          type: 'new_reservation',
          message: 'Nova reserva recebida via Airbnb - Studio Copacabana',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          priority: 'info'
        },
        {
          id: 3,
          type: 'low_stock',
          message: 'Estoque baixo: Desinfetante (8 litros restantes)',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          priority: 'warning'
        }
      ],
      user
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
