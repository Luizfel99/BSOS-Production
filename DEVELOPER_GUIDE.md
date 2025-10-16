# 🧑‍💻 Guia de Desenvolvimento - Bright & Shine

## 📋 Índice
1. [Visão Geral Técnica](#visão-geral-técnica)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Banco de Dados](#banco-de-dados)
4. [APIs e Endpoints](#apis-e-endpoints)
5. [Componentes React](#componentes-react)
6. [Integrações Externas](#integrações-externas)
7. [Deploy e Produção](#deploy-e-produção)

## 🏗 Visão Geral Técnica

### Stack Tecnológico
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Simulado (pronto para PostgreSQL/MongoDB)
- **Integrações**: REST APIs + Webhooks
- **Comunicação**: WhatsApp API, SendGrid, Twilio

### Estrutura de Arquivos
```
src/
├── app/
│   ├── api/                    # Endpoints da API
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── notifications/
│   │   ├── integrations/
│   │   └── webhooks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                 # Componentes React
├── lib/
│   └── database.ts            # Banco de dados simulado
└── services/
    ├── apiIntegrations.ts     # Orquestrador de integrações
    └── webhookHandlers.ts     # Processamento de webhooks
```

## 🏛 Arquitetura do Sistema

### Padrões de Design
- **Component-Based**: Cada funcionalidade é um componente isolado
- **API-First**: Todas as operações passam por APIs
- **Event-Driven**: Webhooks para automação
- **Separation of Concerns**: Lógica separada por responsabilidade

### Fluxo de Dados
```
1. UI Component → 2. API Route → 3. Database → 4. Response → 5. UI Update
```

### Principais Entidades
```typescript
// Estruturas principais
interface Property {
  id: string;
  name: string;
  platform: 'airbnb' | 'booking' | 'vrbo';
  address: string;
  instructions: string;
  amenities: string[];
}

interface Task {
  id: string;
  propertyId: string;
  type: 'checkout' | 'checkin' | 'maintenance';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  checklist: ChecklistItem[];
  priority: 'low' | 'medium' | 'high';
}

interface Reservation {
  id: string;
  propertyId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  platform: string;
  status: 'confirmed' | 'cancelled';
}
```

## 🗄 Banco de Dados

### Estrutura Atual (Simulado)
```typescript
// src/lib/database.ts
class SimulatedDatabase {
  private users: User[] = [];
  private properties: Property[] = [];
  private reservations: Reservation[] = [];
  private tasks: Task[] = [];
  private notifications: Notification[] = [];
  private inventory: InventoryItem[] = [];
  private suppliers: Supplier[] = [];
  private evaluations: Evaluation[] = [];

  // Métodos CRUD para cada entidade
  async create<T>(entity: string, data: T): Promise<T>
  async read<T>(entity: string, filters?: any): Promise<T[]>
  async update<T>(entity: string, id: string, data: Partial<T>): Promise<T>
  async delete(entity: string, id: string): Promise<boolean>
}
```

### Migração para Produção
Para migrar para PostgreSQL:

```sql
-- Exemplo de tabelas
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50),
  address TEXT,
  instructions TEXT,
  amenities TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  type VARCHAR(50),
  status VARCHAR(50),
  assigned_to VARCHAR(255),
  checklist JSONB,
  priority VARCHAR(20),
  scheduled_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🌐 APIs e Endpoints

### Dashboard API
```typescript
// GET /api/dashboard
{
  "totalTasks": 42,
  "completedToday": 12,
  "totalProperties": 15,
  "totalRevenue": 12500,
  "cleanerPerformance": [
    {
      "id": "cleaner-1",
      "name": "Maria Silva",
      "tasksCompleted": 8,
      "avgRating": 4.8,
      "bonus": 200
    }
  ],
  "nextEvents": [
    {
      "id": "event-1",
      "type": "checkout",
      "property": "Apto Centro",
      "time": "14:00",
      "guest": "João Santos"
    }
  ]
}
```

### Tasks API
```typescript
// GET /api/tasks
// POST /api/tasks
// PUT /api/tasks?id={taskId}

interface TaskRequest {
  propertyId: string;
  type: 'checkout' | 'checkin' | 'maintenance';
  scheduledDate: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  instructions?: string;
}
```

### Notifications API
```typescript
// POST /api/notifications
interface NotificationRequest {
  type: 'whatsapp' | 'email' | 'sms';
  recipients: string[];
  template: string;
  variables: Record<string, any>;
  scheduledFor?: string;
}
```

### Integrations API
```typescript
// GET /api/integrations?action=status
{
  "airbnb": { "connected": true, "lastSync": "2024-01-15T10:30:00Z" },
  "hostaway": { "connected": false, "error": "Invalid API key" },
  "booking": { "connected": true, "lastSync": "2024-01-15T09:15:00Z" }
}

// POST /api/integrations
{
  "platform": "airbnb",
  "action": "sync_reservations",
  "credentials": {
    "clientId": "xxx",
    "clientSecret": "xxx"
  }
}
```

## ⚛️ Componentes React

### Dashboard Principal
```typescript
// src/app/page.tsx
'use client';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    setDashboardData(data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardContent data={dashboardData} />;
      case 'tasks': return <GestaoTarefas />;
      case 'airbnb': return <GestaoAirbnb />;
      // ... outros casos
    }
  };
}
```

### Gestão de Tarefas
```typescript
// src/components/GestaoTarefas.tsx
export default function GestaoTarefas() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // Buscar tarefas da API
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  // Atualizar status da tarefa
  const updateTaskStatus = async (taskId: string, status: string) => {
    await fetch(`/api/tasks?id=${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchTasks(); // Recarregar dados
  };
}
```

### Padrão de Hooks Customizados
```typescript
// hooks/useApi.ts
export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(endpoint)
      .then(response => response.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error, refetch: () => fetchData() };
}

// Uso no componente
const { data: tasks, loading, refetch } = useApi<Task[]>('/api/tasks');
```

## 🔗 Integrações Externas

### Airbnb Integration
```typescript
// services/apiIntegrations.ts
export class AirbnbIntegration {
  private clientId: string;
  private clientSecret: string;

  async getReservations(): Promise<Reservation[]> {
    const response = await fetch('https://api.airbnb.com/v2/reservations', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async createWebhook(url: string): Promise<void> {
    await fetch('https://api.airbnb.com/v2/webhooks', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
      body: JSON.stringify({
        url,
        events: ['reservation.created', 'reservation.updated']
      })
    });
  }
}
```

### WhatsApp Business API
```typescript
// services/whatsappService.ts
export class WhatsAppService {
  private apiToken: string;

  async sendMessage(to: string, template: string, variables: any[]): Promise<void> {
    await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: template,
          language: { code: 'pt_BR' },
          components: [{
            type: 'body',
            parameters: variables.map(value => ({ type: 'text', text: value }))
          }]
        }
      })
    });
  }
}
```

### Webhook Handlers
```typescript
// services/webhookHandlers.ts
export class WebhookProcessor {
  async processAirbnbWebhook(payload: any): Promise<void> {
    const { event_type, data } = payload;

    switch (event_type) {
      case 'reservation.created':
        await this.handleNewReservation(data);
        break;
      case 'reservation.updated':
        await this.handleReservationUpdate(data);
        break;
    }
  }

  private async handleNewReservation(reservation: any): Promise<void> {
    // 1. Salvar reserva no banco
    await database.create('reservations', reservation);

    // 2. Criar tarefas automáticas
    await this.createCleaningTasks(reservation);

    // 3. Enviar notificações
    await this.sendNotifications(reservation);
  }
}
```

## 🚀 Deploy e Produção

### Variáveis de Ambiente
```env
# .env.local (desenvolvimento)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.production (produção)
NEXT_PUBLIC_APP_URL=https://brightshine.vercel.app

# Banco de dados
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Integrações
AIRBNB_CLIENT_ID=your_airbnb_client_id
AIRBNB_CLIENT_SECRET=your_airbnb_client_secret
HOSTAWAY_API_KEY=your_hostaway_api_key

# Comunicações
WHATSAPP_API_TOKEN=your_whatsapp_token
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Segurança
JWT_SECRET=your_jwt_secret
WEBHOOK_SECRET=your_webhook_secret
```

### Deploy Automático (Vercel)
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://brightshine.vercel.app"
  }
}
```

### Scripts de Build
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js"
  }
}
```

### Monitoring e Logs
```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Uso nas APIs
logger.info('Task created', { taskId: task.id, propertyId: task.propertyId });
logger.error('Integration failed', { platform: 'airbnb', error: error.message });
```

## 🔧 Ferramentas de Desenvolvimento

### Comandos Úteis
```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run type-check   # Verificação de tipos
npm run lint         # Análise de código

# Banco de dados
npm run db:migrate   # Executar migrações
npm run db:seed      # Popular com dados iniciais

# Deploy
vercel --prod        # Deploy para produção
vercel logs          # Ver logs de produção
```

### Debugging
```typescript
// Debug de APIs
console.log('API Request:', { method, url, body });
console.log('Database Query:', { entity, filters });
console.log('Integration Response:', { platform, status, data });

// Error Handling
try {
  const result = await apiCall();
} catch (error) {
  logger.error('API call failed', { error: error.message, stack: error.stack });
  throw new Error('Internal server error');
}
```

### Testes
```typescript
// __tests__/api/tasks.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../../src/app/api/tasks/route';

describe('/api/tasks', () => {
  it('should create a new task', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        propertyId: 'prop-1',
        type: 'checkout',
        scheduledDate: '2024-01-15T14:00:00Z'
      }
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(201);
  });
});
```

## 📚 Recursos Adicionais

### Documentação de APIs
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Integrações
- [Airbnb API](https://www.airbnb.com/partner/api-docs)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/)
- [SendGrid API](https://docs.sendgrid.com/)

### Deploy
- [Vercel](https://vercel.com/docs)
- [Railway](https://docs.railway.app/)
- [Supabase](https://supabase.com/docs)

---

**Última atualização**: Janeiro 2024
**Versão**: 1.0.0