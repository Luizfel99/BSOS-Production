// Database simulado em memória para desenvolvimento
// Em produção, substituir por um banco real (PostgreSQL, MongoDB, etc.)

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cleaner' | 'client';
  phone?: string;
  avatar?: string;
  active: boolean;
  createdAt: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'studio' | 'commercial';
  platform: string;
  platformId: string;
  ownerId: string;
  keyLocation?: string;
  cleaningInstructions?: string;
  amenities: string[];
  size: number; // metros quadrados
  bedrooms: number;
  bathrooms: number;
  active: boolean;
  createdAt: string;
}

interface Reservation {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  platform: string;
  platformReservationId: string;
  totalValue?: number;
  cleaningFee?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CleaningTask {
  id: string;
  propertyId: string;
  reservationId?: string;
  title: string;
  description: string;
  type: 'checkout_cleaning' | 'checkin_preparation' | 'maintenance' | 'deep_cleaning' | 'inspection';
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // minutos
  actualDuration?: number;
  assignedCleanerId?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  checklist: ChecklistItem[];
  photos?: string[];
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  required: boolean;
  category: 'cleaning' | 'maintenance' | 'supplies' | 'inspection';
}

interface Notification {
  id: string;
  recipientId: string;
  recipientType: 'user' | 'phone' | 'email';
  type: 'whatsapp' | 'email' | 'sms' | 'push';
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  templateId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplierId?: string;
  location?: string;
  expiryDate?: string;
  lastRestocked: string;
  active: boolean;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  rating?: number;
  active: boolean;
}

interface ApiIntegration {
  id: string;
  platform: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  credentials: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
  };
  webhookUrl?: string;
  lastSync?: string;
  syncInterval: number; // minutos
  autoSync: boolean;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Banco de dados simulado
class SimulatedDatabase {
  private users: User[] = [
    {
      id: 'user-001',
      name: 'Admin Sistema',
      email: 'admin@brightshine.com',
      role: 'admin',
      phone: '+5521999999999',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-002',
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      role: 'cleaner',
      phone: '+5521988888888',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-003',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      role: 'cleaner',
      phone: '+5521977777777',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-004',
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      role: 'cleaner',
      phone: '+5521966666666',
      active: true,
      createdAt: new Date().toISOString()
    }
  ];

  private properties: Property[] = [
    {
      id: 'prop-001',
      name: 'Apartamento Centro',
      address: 'Rua das Flores, 123 - Centro, Rio de Janeiro',
      type: 'apartment',
      platform: 'airbnb',
      platformId: 'airbnb-123',
      ownerId: 'owner-001',
      keyLocation: 'Portaria - Apartamento 501',
      cleaningInstructions: 'Atenção especial aos tapetes persas. Não usar produtos químicos fortes.',
      amenities: ['wifi', 'ar_condicionado', 'tv', 'cozinha_completa'],
      size: 80,
      bedrooms: 2,
      bathrooms: 1,
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prop-002',
      name: 'Casa Ipanema',
      address: 'Rua Visconde de Pirajá, 456 - Ipanema, Rio de Janeiro',
      type: 'house',
      platform: 'hostaway',
      platformId: 'hostaway-456',
      ownerId: 'owner-002',
      keyLocation: 'Caixa de correio - código 1234',
      amenities: ['wifi', 'ar_condicionado', 'piscina', 'churrasqueira'],
      size: 120,
      bedrooms: 3,
      bathrooms: 2,
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prop-003',
      name: 'Studio Copacabana',
      address: 'Av. Atlântica, 789 - Copacabana, Rio de Janeiro',
      type: 'studio',
      platform: 'airbnb',
      platformId: 'airbnb-789',
      ownerId: 'owner-001',
      keyLocation: 'Recepção 24h',
      amenities: ['wifi', 'ar_condicionado', 'tv'],
      size: 35,
      bedrooms: 1,
      bathrooms: 1,
      active: true,
      createdAt: new Date().toISOString()
    }
  ];

  private reservations: Reservation[] = [
    {
      id: 'res-001',
      propertyId: 'prop-001',
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      guestPhone: '+1234567890',
      checkIn: '2024-01-22T15:00:00Z',
      checkOut: '2024-01-25T11:00:00Z',
      guests: 2,
      status: 'confirmed',
      platform: 'airbnb',
      platformReservationId: 'airbnb-res-001',
      totalValue: 1200,
      cleaningFee: 150,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'res-002',
      propertyId: 'prop-002',
      guestName: 'Maria Santos',
      guestEmail: 'maria.santos@email.com',
      checkIn: '2024-01-23T16:00:00Z',
      checkOut: '2024-01-26T10:00:00Z',
      guests: 4,
      status: 'confirmed',
      platform: 'hostaway',
      platformReservationId: 'hostaway-res-002',
      totalValue: 1800,
      cleaningFee: 200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private cleaningTasks: CleaningTask[] = [
    {
      id: 'task-001',
      propertyId: 'prop-001',
      reservationId: 'res-001',
      title: 'Limpeza Pós-Checkout',
      description: 'Limpeza completa após saída do hóspede John Smith',
      type: 'checkout_cleaning',
      scheduledDate: '2024-01-25',
      scheduledTime: '12:00',
      estimatedDuration: 120,
      assignedCleanerId: 'user-002',
      status: 'assigned',
      priority: 'high',
      checklist: [
        { id: 'check-001', description: 'Trocar roupa de cama', completed: false, required: true, category: 'cleaning' },
        { id: 'check-002', description: 'Aspirar tapetes', completed: false, required: true, category: 'cleaning' },
        { id: 'check-003', description: 'Limpar banheiro', completed: false, required: true, category: 'cleaning' },
        { id: 'check-004', description: 'Verificar amenities', completed: false, required: true, category: 'inspection' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private notifications: Notification[] = [];
  private inventory: InventoryItem[] = [
    {
      id: 'inv-001',
      name: 'Detergente Multiuso',
      category: 'Produtos de Limpeza',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'Litros',
      costPerUnit: 8.50,
      location: 'Estoque Principal',
      lastRestocked: new Date().toISOString(),
      active: true
    },
    {
      id: 'inv-002',
      name: 'Papel Higiênico',
      category: 'Descartáveis',
      currentStock: 150,
      minStock: 50,
      maxStock: 200,
      unit: 'Rolos',
      costPerUnit: 2.80,
      location: 'Estoque Principal',
      lastRestocked: new Date().toISOString(),
      active: true
    }
  ];

  private suppliers: Supplier[] = [
    {
      id: 'sup-001',
      name: 'CleanPro Ltda',
      contact: 'João Silva',
      email: 'vendas@cleanpro.com',
      phone: '+5521999887766',
      address: 'Rua dos Fornecedores, 100',
      paymentTerms: '30 dias',
      rating: 4.5,
      active: true
    }
  ];

  private integrations: ApiIntegration[] = [
    {
      id: 'int-001',
      platform: 'airbnb',
      name: 'Airbnb - Conta Principal',
      status: 'connected',
      credentials: {
        accessToken: 'mock-token-airbnb'
      },
      webhookUrl: 'http://localhost:3000/api/webhooks?platform=airbnb',
      lastSync: new Date().toISOString(),
      syncInterval: 15,
      autoSync: true,
      settings: {
        importReservations: true,
        createTasks: true,
        sendNotifications: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Métodos CRUD para Users
  getUsers(): User[] { return this.users; }
  getUserById(id: string): User | undefined { return this.users.find(u => u.id === id); }
  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }
  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  // Métodos CRUD para Properties
  getProperties(): Property[] { return this.properties; }
  getPropertyById(id: string): Property | undefined { return this.properties.find(p => p.id === id); }
  createProperty(property: Omit<Property, 'id' | 'createdAt'>): Property {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  // Métodos CRUD para Reservations
  getReservations(): Reservation[] { return this.reservations; }
  getReservationById(id: string): Reservation | undefined { return this.reservations.find(r => r.id === id); }
  createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Reservation {
    const newReservation: Reservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.reservations.push(newReservation);
    return newReservation;
  }

  // Métodos CRUD para CleaningTasks
  getCleaningTasks(): CleaningTask[] { return this.cleaningTasks; }
  getTaskById(id: string): CleaningTask | undefined { return this.cleaningTasks.find(t => t.id === id); }
  createCleaningTask(task: Omit<CleaningTask, 'id' | 'createdAt' | 'updatedAt'>): CleaningTask {
    const newTask: CleaningTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.cleaningTasks.push(newTask);
    return newTask;
  }
  updateTask(id: string, updates: Partial<CleaningTask>): CleaningTask | null {
    const index = this.cleaningTasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.cleaningTasks[index] = { 
      ...this.cleaningTasks[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    return this.cleaningTasks[index];
  }

  // Métodos para Notifications
  getNotifications(): Notification[] { return this.notifications; }
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  // Métodos para Inventory
  getInventory(): InventoryItem[] { return this.inventory; }
  getInventoryById(id: string): InventoryItem | undefined { return this.inventory.find(i => i.id === id); }
  updateInventoryStock(id: string, newStock: number): InventoryItem | null {
    const index = this.inventory.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.inventory[index] = { 
      ...this.inventory[index], 
      currentStock: newStock,
      lastRestocked: new Date().toISOString()
    };
    return this.inventory[index];
  }

  // Métodos para Integrations
  getIntegrations(): ApiIntegration[] { return this.integrations; }
  getIntegrationById(id: string): ApiIntegration | undefined { return this.integrations.find(i => i.id === id); }
  createIntegration(integration: Omit<ApiIntegration, 'id' | 'createdAt' | 'updatedAt'>): ApiIntegration {
    const newIntegration: ApiIntegration = {
      ...integration,
      id: `int-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.integrations.push(newIntegration);
    return newIntegration;
  }

  // Métodos utilitários
  getTasksByProperty(propertyId: string): CleaningTask[] {
    return this.cleaningTasks.filter(t => t.propertyId === propertyId);
  }

  getTasksByCleaner(cleanerId: string): CleaningTask[] {
    return this.cleaningTasks.filter(t => t.assignedCleanerId === cleanerId);
  }

  getReservationsByProperty(propertyId: string): Reservation[] {
    return this.reservations.filter(r => r.propertyId === propertyId);
  }

  getLowStockItems(): InventoryItem[] {
    return this.inventory.filter(i => i.currentStock <= i.minStock && i.active);
  }

  getTasksForToday(): CleaningTask[] {
    const today = new Date().toISOString().split('T')[0];
    return this.cleaningTasks.filter(t => t.scheduledDate === today);
  }

  getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const tasksToday = this.getTasksForToday();
    const lowStockItems = this.getLowStockItems();
    const activeProperties = this.properties.filter(p => p.active);
    const confirmedReservations = this.reservations.filter(r => r.status === 'confirmed');

    return {
      tasksToday: tasksToday.length,
      lowStockAlerts: lowStockItems.length,
      activeProperties: activeProperties.length,
      confirmedReservations: confirmedReservations.length,
      connectedIntegrations: this.integrations.filter(i => i.status === 'connected').length
    };
  }
}

// Instância global do banco de dados simulado
export const db = new SimulatedDatabase();

// Tipos exportados para uso em outros arquivos
export type {
  User,
  Property,
  Reservation,
  CleaningTask,
  ChecklistItem,
  Notification,
  InventoryItem,
  Supplier,
  ApiIntegration,
  SimulatedDatabase
};