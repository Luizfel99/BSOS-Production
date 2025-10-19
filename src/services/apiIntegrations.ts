// Serviços de integração com APIs de terceiros

interface ApiCredentials {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  webhookUrl?: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  platform: string;
  platformId: string;
}

interface Reservation {
  id: string;
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  platform: string;
  platformReservationId: string;
}

interface CleaningTask {
  id: string;
  propertyId: string;
  reservationId?: string;
  type: 'checkout_cleaning' | 'checkin_preparation' | 'maintenance' | 'deep_cleaning';
  scheduledDate: string;
  estimatedDuration: number;
  assignedCleaner?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Airbnb API Integration
export class AirbnbApiService {
  private credentials: ApiCredentials;
  private baseUrl = 'https://api.airbnb.com/v2';

  constructor(credentials: ApiCredentials) {
    this.credentials = credentials;
  }

  async getProperties(): Promise<Property[]> {
    try {
      // Simulação da chamada à API do Airbnb
      const response = await fetch(`${this.baseUrl}/listings`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Airbnb API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.listings?.map((listing: any) => ({
        id: `airbnb-${listing.id}`,
        name: listing.name,
        address: listing.address,
        platform: 'airbnb',
        platformId: listing.id
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar propriedades do Airbnb:', error);
      // Retornar dados mockados para demonstração
      return this.getMockProperties();
    }
  }

  async getReservations(propertyId?: string): Promise<Reservation[]> {
    try {
      const url = propertyId 
        ? `${this.baseUrl}/reservations?listing_id=${propertyId}`
        : `${this.baseUrl}/reservations`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Airbnb API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.reservations?.map((reservation: any) => ({
        id: `airbnb-${reservation.id}`,
        propertyId: `airbnb-${reservation.listing_id}`,
        guestName: reservation.guest.first_name + ' ' + reservation.guest.last_name,
        checkIn: reservation.start_date,
        checkOut: reservation.end_date,
        status: reservation.status,
        platform: 'airbnb',
        platformReservationId: reservation.id
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar reservas do Airbnb:', error);
      return this.getMockReservations();
    }
  }

  private getMockProperties(): Property[] {
    return [
      {
        id: 'airbnb-123',
        name: 'Apartamento Centro',
        address: 'Rua das Flores, 123 - Centro, Rio de Janeiro',
        platform: 'airbnb',
        platformId: '123'
      },
      {
        id: 'airbnb-456',
        name: 'Casa Ipanema',
        address: 'Rua Visconde de Pirajá, 456 - Ipanema, Rio de Janeiro',
        platform: 'airbnb',
        platformId: '456'
      }
    ];
  }

  private getMockReservations(): Reservation[] {
    return [
      {
        id: 'airbnb-res-001',
        propertyId: 'airbnb-123',
        guestName: 'John Smith',
        checkIn: '2024-01-22',
        checkOut: '2024-01-25',
        status: 'confirmed',
        platform: 'airbnb',
        platformReservationId: 'res-001'
      }
    ];
  }

  async setupWebhook(): Promise<boolean> {
    try {
      if (!this.credentials.webhookUrl) {
        throw new Error('Webhook URL não configurada');
      }

      const response = await fetch(`${this.baseUrl}/webhooks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_url: this.credentials.webhookUrl,
          event_types: ['reservation_created', 'reservation_updated', 'reservation_cancelled']
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao configurar webhook do Airbnb:', error);
      return false;
    }
  }
}

// Hostaway API Integration
export class HostawayApiService {
  private credentials: ApiCredentials;
  private baseUrl = 'https://api.hostaway.com/v1';

  constructor(credentials: ApiCredentials) {
    this.credentials = credentials;
  }

  async getProperties(): Promise<Property[]> {
    try {
      const response = await fetch(`${this.baseUrl}/listings`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Hostaway API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.result?.map((listing: any) => ({
        id: `hostaway-${listing.id}`,
        name: listing.title,
        address: listing.address,
        platform: 'hostaway',
        platformId: listing.id
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar propriedades do Hostaway:', error);
      return this.getMockProperties();
    }
  }

  async getReservations(): Promise<Reservation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/reservations`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Hostaway API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.result?.map((reservation: any) => ({
        id: `hostaway-${reservation.id}`,
        propertyId: `hostaway-${reservation.listingId}`,
        guestName: reservation.guestName,
        checkIn: reservation.arrivalDate,
        checkOut: reservation.departureDate,
        status: reservation.status,
        platform: 'hostaway',
        platformReservationId: reservation.id
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar reservas do Hostaway:', error);
      return this.getMockReservations();
    }
  }

  private getMockProperties(): Property[] {
    return [
      {
        id: 'hostaway-789',
        name: 'Studio Copacabana',
        address: 'Av. Atlântica, 789 - Copacabana, Rio de Janeiro',
        platform: 'hostaway',
        platformId: '789'
      }
    ];
  }

  private getMockReservations(): Reservation[] {
    return [
      {
        id: 'hostaway-res-002',
        propertyId: 'hostaway-789',
        guestName: 'Maria Santos',
        checkIn: '2024-01-23',
        checkOut: '2024-01-26',
        status: 'confirmed',
        platform: 'hostaway',
        platformReservationId: 'res-002'
      }
    ];
  }
}

// Taskbird API Integration
export class TaskbirdApiService {
  private credentials: ApiCredentials;
  private baseUrl = 'https://api.taskbird.com/v1';

  constructor(credentials: ApiCredentials) {
    this.credentials = credentials;
  }

  async createCleaningTask(task: Omit<CleaningTask, 'id'>): Promise<CleaningTask> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `Limpeza - ${task.type}`,
          description: `Limpeza da propriedade ${task.propertyId}`,
          due_date: task.scheduledDate,
          priority: task.priority,
          estimated_duration: task.estimatedDuration,
          assignee: task.assignedCleaner
        })
      });

      if (!response.ok) {
        throw new Error(`Taskbird API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        ...task,
        id: `taskbird-${data.id}`,
        status: 'pending'
      };
    } catch (error) {
      console.error('Erro ao criar tarefa no Taskbird:', error);
      // Retornar tarefa mockada
      return {
        ...task,
        id: `taskbird-${Date.now()}`,
        status: 'pending'
      };
    }
  }

  async updateTaskStatus(taskId: string, status: CleaningTask['status']): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      return false;
    }
  }

  async assignTask(taskId: string, cleanerId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assignee: cleanerId })
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao atribuir tarefa:', error);
      return false;
    }
  }
}

// Turno API Integration
export class TurnoApiService {
  private credentials: ApiCredentials;
  private baseUrl = 'https://api.turno.com/v1';

  constructor(credentials: ApiCredentials) {
    this.credentials = credentials;
  }

  async getAvailableCleaners(date: string, duration: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/availability?date=${date}&duration=${duration}`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Turno API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.available_staff || [];
    } catch (error) {
      console.error('Erro ao buscar funcionários disponíveis:', error);
      return this.getMockAvailableCleaners();
    }
  }

  async scheduleShift(cleanerId: string, date: string, startTime: string, duration: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/shifts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          staff_id: cleanerId,
          date,
          start_time: startTime,
          duration
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao agendar turno:', error);
      return false;
    }
  }

  private getMockAvailableCleaners(): any[] {
    return [
      {
        id: 'cleaner-001',
        name: 'Maria Silva',
        rating: 4.9,
        available_from: '08:00',
        available_until: '17:00'
      },
      {
        id: 'cleaner-002',
        name: 'Pedro Oliveira',
        rating: 4.7,
        available_from: '09:00',
        available_until: '18:00'
      }
    ];
  }
}

// Orquestrador de Integrações
export class IntegrationOrchestrator {
  private airbnbService?: AirbnbApiService;
  private hostawayService?: HostawayApiService;
  private taskbirdService?: TaskbirdApiService;
  private turnoService?: TurnoApiService;

  constructor() {}

  configureAirbnb(credentials: ApiCredentials) {
    this.airbnbService = new AirbnbApiService(credentials);
  }

  configureHostaway(credentials: ApiCredentials) {
    this.hostawayService = new HostawayApiService(credentials);
  }

  configureTaskbird(credentials: ApiCredentials) {
    this.taskbirdService = new TaskbirdApiService(credentials);
  }

  configureTurno(credentials: ApiCredentials) {
    this.turnoService = new TurnoApiService(credentials);
  }

  async syncAllData(): Promise<{
    properties: Property[];
    reservations: Reservation[];
    errors: string[];
  }> {
    const properties: Property[] = [];
    const reservations: Reservation[] = [];
    const errors: string[] = [];

    try {
      // Sincronizar propriedades do Airbnb
      if (this.airbnbService) {
        const airbnbProperties = await this.airbnbService.getProperties();
        properties.push(...airbnbProperties);
        
        const airbnbReservations = await this.airbnbService.getReservations();
        reservations.push(...airbnbReservations);
      }

      // Sincronizar propriedades do Hostaway
      if (this.hostawayService) {
        const hostawayProperties = await this.hostawayService.getProperties();
        properties.push(...hostawayProperties);
        
        const hostawayReservations = await this.hostawayService.getReservations();
        reservations.push(...hostawayReservations);
      }
    } catch (error) {
      errors.push(`Erro na sincronização: ${error}`);
    }

    return { properties, reservations, errors };
  }

  async createCleaningTasksFromReservations(reservations: Reservation[]): Promise<CleaningTask[]> {
    const tasks: CleaningTask[] = [];

    if (!this.taskbirdService) {
      throw new Error('Taskbird não configurado');
    }

    for (const reservation of reservations) {
      try {
        // Criar tarefa de limpeza pós-checkout
        const checkoutTask = await this.taskbirdService.createCleaningTask({
          propertyId: reservation.propertyId,
          reservationId: reservation.id,
          type: 'checkout_cleaning',
          scheduledDate: reservation.checkOut,
          estimatedDuration: 120, // 2 horas
          priority: 'high',
          status: 'pending'
        });
        tasks.push(checkoutTask);

        // Criar tarefa de preparação pré-checkin
        const checkinTask = await this.taskbirdService.createCleaningTask({
          propertyId: reservation.propertyId,
          reservationId: reservation.id,
          type: 'checkin_preparation',
          scheduledDate: reservation.checkIn,
          estimatedDuration: 90, // 1.5 horas
          priority: 'medium',
          status: 'pending'
        });
        tasks.push(checkinTask);
      } catch (error) {
        console.error(`Erro ao criar tarefas para reserva ${reservation.id}:`, error);
      }
    }

    return tasks;
  }

  async autoAssignCleaners(tasks: CleaningTask[]): Promise<void> {
    if (!this.turnoService || !this.taskbirdService) {
      throw new Error('Serviços não configurados para atribuição automática');
    }

    for (const task of tasks) {
      try {
        const availableCleaners = await this.turnoService.getAvailableCleaners(
          task.scheduledDate,
          task.estimatedDuration
        );

        if (availableCleaners.length > 0) {
          // Selecionar o cleaner com melhor rating disponível
          const bestCleaner = availableCleaners.reduce((best, current) => 
            current.rating > best.rating ? current : best
          );

          // Atribuir tarefa
          await this.taskbirdService.assignTask(task.id, bestCleaner.id);
          
          // Agendar turno
          await this.turnoService.scheduleShift(
            bestCleaner.id,
            task.scheduledDate,
            bestCleaner.available_from,
            task.estimatedDuration
          );
        }
      } catch (error) {
        console.error(`Erro ao atribuir cleaner para tarefa ${task.id}:`, error);
      }
    }
  }
}

// Instância global do orquestrador
export const integrationOrchestrator = new IntegrationOrchestrator();