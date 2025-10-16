import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const stats = db.getDashboardStats();
    const tasksToday = db.getTasksForToday();
    const lowStockItems = db.getLowStockItems();
    const properties = db.getProperties();
    const users = db.getUsers().filter(u => u.role === 'cleaner' && u.active);

    // Calcular métricas avançadas
    const totalRevenue = db.getReservations()
      .filter(r => r.status === 'confirmed')
      .reduce((total, r) => total + (r.totalValue || 0), 0);

    const completedTasksToday = tasksToday.filter(t => t.status === 'completed').length;
    const inProgressTasksList = tasksToday.filter(t => t.status === 'in_progress');

    // Performance dos cleaners
    const cleanerPerformance = users.map(cleaner => {
      const cleanerTasks = db.getTasksByCleaner(cleaner.id);
      const completedTasks = cleanerTasks.filter(t => t.status === 'completed');
      const avgRating = completedTasks.length > 0 
        ? completedTasks.reduce((sum, t) => sum + (t.rating || 0), 0) / completedTasks.length 
        : 0;
      
      return {
        id: cleaner.id,
        name: cleaner.name,
        tasksToday: cleanerTasks.filter(t => t.scheduledDate === new Date().toISOString().split('T')[0]).length,
        completedTasks: completedTasks.length,
        avgRating: avgRating.toFixed(1),
        status: inProgressTasksList.some(t => t.assignedCleanerId === cleaner.id) ? 'Em Serviço' : 'Disponível'
      };
    });

    // Próximos eventos (checkouts/checkins)
    const today = new Date();
    const nextEvents = db.getReservations()
      .filter(r => r.status === 'confirmed')
      .map(r => ({
        type: new Date(r.checkIn) > today ? 'checkin' : 'checkout',
        time: new Date(r.checkIn) > today ? r.checkIn : r.checkOut,
        property: properties.find(p => p.id === r.propertyId)?.name || 'Propriedade',
        guest: r.guestName,
        status: 'pending'
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
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
      lowStockItems: lowStockItems.map(item => ({
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
      ]
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
