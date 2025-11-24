# 🔌 Implementação de Integrações - APIs Externas

## 🎯 Guia Prático - Fase 2

### 1. **Airbnb Integration**

#### **A. Configuração da API:**

```typescript
// src/services/integrations/airbnb.service.ts
export class AirbnbService {
  private baseUrl = "https://api.airbnb.com/v2";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.AIRBNB_API_KEY!;
  }

  async getListings(hostId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/listings`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data.listings;
    } catch (error) {
      console.error("Erro ao buscar propriedades Airbnb:", error);
      throw error;
    }
  }

  async getReservations(listingId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/listings/${listingId}/reservations`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      return data.reservations;
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      throw error;
    }
  }

  async getCalendar(listingId: string, startDate: string, endDate: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/listings/${listingId}/calendar?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      return data.calendar;
    } catch (error) {
      console.error("Erro ao buscar calendário:", error);
      throw error;
    }
  }

  // Transformar dados Airbnb para formato BSOS
  transformToProperty(airbnbListing: any) {
    return {
      name: airbnbListing.name,
      address: airbnbListing.address,
      type: "APARTMENT" as const,
      rooms: airbnbListing.bedrooms || 1,
      bathrooms: airbnbListing.bathrooms || 1,
      airbnbId: airbnbListing.id.toString(),
      checkInTime: "15:00",
      checkOutTime: "11:00",
    };
  }

  transformToReservation(airbnbReservation: any) {
    return {
      guestName: airbnbReservation.guest.name,
      checkIn: new Date(airbnbReservation.start_date),
      checkOut: new Date(airbnbReservation.end_date),
      status: airbnbReservation.status,
      externalId: airbnbReservation.id.toString(),
    };
  }
}
```

### 2. **Google Calendar Integration**

#### **A. Configuração OAuth2:**

```typescript
// src/services/integrations/calendar.service.ts
import { google } from "googleapis";

export class GoogleCalendarService {
  private calendar: any;

  constructor() {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials if available
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      auth.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
    }

    this.calendar = google.calendar({ version: "v3", auth });
  }

  async createCleaningEvent(cleaning: any) {
    try {
      const event = {
        summary: `Limpeza - ${cleaning.property.name}`,
        description: `
          🏠 Propriedade: ${cleaning.property.name}
          📍 Endereço: ${cleaning.property.address}
          👤 Funcionário: ${cleaning.employee.name}
          💰 Valor: R$ ${cleaning.price}
          
          📝 Checklist: ${cleaning.checklist ? "Incluído" : "Padrão"}
        `,
        start: {
          dateTime: cleaning.scheduledDate.toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        end: {
          dateTime: new Date(
            cleaning.scheduledDate.getTime() +
              cleaning.estimatedDuration * 60000
          ).toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        attendees: [
          {
            email: cleaning.employee.email,
            displayName: cleaning.employee.name,
            responseStatus: "needsAction",
          },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 }, // 1 dia antes
            { method: "popup", minutes: 60 }, // 1 hora antes
          ],
        },
        colorId: "11", // Vermelho para limpezas
        extendedProperties: {
          shared: {
            bsosCleaningId: cleaning.id,
            bsosPropertyId: cleaning.propertyId,
            bsosEmployeeId: cleaning.employeeId,
          },
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        sendUpdates: "all",
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao criar evento no calendário:", error);
      throw error;
    }
  }

  async updateCleaningEvent(eventId: string, updates: any) {
    try {
      const response = await this.calendar.events.patch({
        calendarId: "primary",
        eventId: eventId,
        resource: updates,
        sendUpdates: "all",
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw error;
    }
  }

  async getEmployeeSchedule(
    employeeEmail: string,
    startDate: Date,
    endDate: Date
  ) {
    try {
      const response = await this.calendar.events.list({
        calendarId: employeeEmail,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        q: "Limpeza", // Filtrar apenas eventos de limpeza
      });

      return response.data.items;
    } catch (error) {
      console.error("Erro ao buscar agenda do funcionário:", error);
      throw error;
    }
  }

  async createRecurringEvent(cleaning: any, recurrence: string[]) {
    // Para limpezas recorrentes (ex: toda semana)
    try {
      const event = {
        summary: `Limpeza Recorrente - ${cleaning.property.name}`,
        description: `Limpeza automática agendada`,
        start: {
          dateTime: cleaning.scheduledDate.toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        end: {
          dateTime: new Date(
            cleaning.scheduledDate.getTime() +
              cleaning.estimatedDuration * 60000
          ).toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        recurrence: recurrence, // Ex: ['RRULE:FREQ=WEEKLY;BYDAY=SA']
      };

      const response = await this.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao criar evento recorrente:", error);
      throw error;
    }
  }
}
```

### 3. **Stripe Integration**

#### **A. Configuração de Pagamentos:**

```typescript
// src/services/integrations/stripe.service.ts
import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });
  }

  // Pagamento de limpeza pelo cliente
  async createPaymentIntent(
    amount: number,
    currency = "brl",
    metadata: any = {}
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency,
        metadata: {
          bsosCleaningId: metadata.cleaningId,
          bsosPropertyId: metadata.propertyId,
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error("Erro ao criar payment intent:", error);
      throw error;
    }
  }

  // Pagamento para funcionários
  async createTransfer(
    employeeStripeAccountId: string,
    amount: number,
    cleaningId: string
  ) {
    try {
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: "brl",
        destination: employeeStripeAccountId,
        metadata: {
          bsosCleaningId: cleaningId,
          type: "cleaning_payment",
        },
      });

      return transfer;
    } catch (error) {
      console.error("Erro ao criar transferência:", error);
      throw error;
    }
  }

  // Criar conta conectada para funcionário
  async createConnectedAccount(employee: any) {
    try {
      const account = await this.stripe.accounts.create({
        type: "express",
        country: "BR",
        email: employee.email,
        metadata: {
          bsosEmployeeId: employee.id,
          bsosCompanyId: employee.companyId,
        },
      });

      return account;
    } catch (error) {
      console.error("Erro ao criar conta conectada:", error);
      throw error;
    }
  }

  // Link de onboarding para funcionário
  async createAccountLink(
    accountId: string,
    returnUrl: string,
    refreshUrl: string
  ) {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        return_url: returnUrl,
        refresh_url: refreshUrl,
        type: "account_onboarding",
      });

      return accountLink;
    } catch (error) {
      console.error("Erro ao criar link de onboarding:", error);
      throw error;
    }
  }

  // Webhook para processar eventos
  async handleWebhook(payload: string, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSuccess(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "payment_intent.payment_failed":
          await this.handlePaymentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "transfer.created":
          await this.handleTransferCreated(
            event.data.object as Stripe.Transfer
          );
          break;

        default:
          console.log(`Evento não tratado: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error("Erro no webhook:", error);
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const cleaningId = paymentIntent.metadata.bsosCleaningId;

    if (cleaningId) {
      // Atualizar status no banco
      await prisma.cleaning.update({
        where: { id: cleaningId },
        data: { paid: true },
      });

      // Criar registro de pagamento
      await prisma.payment.create({
        data: {
          amount: paymentIntent.amount / 100,
          type: "CLEANING_FEE",
          status: "PAID",
          method: "Cartão",
          reference: paymentIntent.id,
          companyId: paymentIntent.metadata.bsosCompanyId,
        },
      });
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const cleaningId = paymentIntent.metadata.bsosCleaningId;

    if (cleaningId) {
      // Marcar como não pago e criar notificação
      await prisma.cleaning.update({
        where: { id: cleaningId },
        data: { paid: false },
      });

      // Enviar notificação para admin
      // await notificationService.send(...)
    }
  }

  private async handleTransferCreated(transfer: Stripe.Transfer) {
    // Registrar pagamento para funcionário
    await prisma.payment.create({
      data: {
        amount: transfer.amount / 100,
        type: "EMPLOYEE_PAYMENT",
        status: "PAID",
        reference: transfer.id,
        employeeId: transfer.metadata.bsosEmployeeId,
        companyId: transfer.metadata.bsosCompanyId,
      },
    });
  }
}
```

### 4. **Hostaway Integration**

#### **A. Multi-plataforma:**

```typescript
// src/services/integrations/hostaway.service.ts
export class HostawayService {
  private baseUrl = "https://api.hostaway.com/v1";
  private accessToken: string;

  constructor() {
    this.accessToken = process.env.HOSTAWAY_ACCESS_TOKEN!;
  }

  async getListings() {
    try {
      const response = await fetch(`${this.baseUrl}/listings`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Erro ao buscar propriedades Hostaway:", error);
      throw error;
    }
  }

  async getReservations(
    listingId?: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams();
    if (listingId) params.append("listingId", listingId);
    if (startDate) params.append("arrivalStartDate", startDate);
    if (endDate) params.append("arrivalEndDate", endDate);

    try {
      const response = await fetch(`${this.baseUrl}/reservations?${params}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      throw error;
    }
  }

  async syncAllReservations() {
    try {
      // Buscar todas as reservas dos últimos 30 dias
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const reservations = await this.getReservations(
        undefined,
        startDate,
        endDate
      );

      for (const reservation of reservations) {
        await this.syncReservation(reservation);
      }

      return { synced: reservations.length };
    } catch (error) {
      console.error("Erro na sincronização:", error);
      throw error;
    }
  }

  private async syncReservation(hostawayReservation: any) {
    try {
      // Buscar propriedade no BSOS
      const property = await prisma.property.findFirst({
        where: {
          OR: [
            { airbnbId: hostawayReservation.airbnbListingId?.toString() },
            { hostAwayId: hostawayReservation.listingId?.toString() },
          ],
        },
      });

      if (!property) {
        console.warn(
          `Propriedade não encontrada para reserva ${hostawayReservation.id}`
        );
        return;
      }

      // Verificar se já existe limpeza para esta reserva
      const existingCleaning = await prisma.cleaning.findFirst({
        where: {
          propertyId: property.id,
          scheduledDate: new Date(hostawayReservation.departureDate),
        },
      });

      if (!existingCleaning) {
        // Criar limpeza automática para checkout
        await prisma.cleaning.create({
          data: {
            scheduledDate: new Date(hostawayReservation.departureDate),
            price: this.calculateCleaningPrice(property),
            status: "SCHEDULED",
            notes: `Limpeza automática - Checkout reserva #${hostawayReservation.id}`,
            companyId: property.companyId,
            propertyId: property.id,
            employeeId: await this.assignEmployee(property.id),
          },
        });

        console.log(`✅ Limpeza criada para propriedade ${property.name}`);
      }
    } catch (error) {
      console.error("Erro ao sincronizar reserva:", error);
    }
  }

  private calculateCleaningPrice(property: any): number {
    // Lógica para calcular preço baseado no tipo/tamanho da propriedade
    const basePrice = 100;
    const roomMultiplier = property.rooms * 20;
    const bathroomMultiplier = property.bathrooms * 15;

    return basePrice + roomMultiplier + bathroomMultiplier;
  }

  private async assignEmployee(propertyId: string): string {
    // Lógica para atribuir funcionário automaticamente
    // Pode ser baseada em localização, disponibilidade, etc.

    const employees = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
        isActive: true,
      },
    });

    // Por enquanto, atribui aleatoriamente
    const randomEmployee =
      employees[Math.floor(Math.random() * employees.length)];
    return randomEmployee.id;
  }
}
```

### 5. **Service Orchestrator**

#### **A. Coordenador de Integrações:**

```typescript
// src/services/integrations/integration.orchestrator.ts
import { AirbnbService } from "./airbnb.service";
import { GoogleCalendarService } from "./calendar.service";
import { StripeService } from "./stripe.service";
import { HostawayService } from "./hostaway.service";

export class IntegrationOrchestrator {
  private airbnb: AirbnbService;
  private calendar: GoogleCalendarService;
  private stripe: StripeService;
  private hostaway: HostawayService;

  constructor() {
    this.airbnb = new AirbnbService();
    this.calendar = new GoogleCalendarService();
    this.stripe = new StripeService();
    this.hostaway = new HostawayService();
  }

  // Processo completo: Reserva → Limpeza → Pagamento
  async processNewReservation(reservationData: any) {
    try {
      console.log("🔄 Processando nova reserva...");

      // 1. Criar limpeza no sistema
      const cleaning = await prisma.cleaning.create({
        data: {
          scheduledDate: new Date(reservationData.checkoutDate),
          price: this.calculatePrice(reservationData),
          status: "SCHEDULED",
          companyId: reservationData.companyId,
          propertyId: reservationData.propertyId,
          employeeId: reservationData.assignedEmployeeId,
        },
        include: {
          property: true,
          employee: true,
        },
      });

      // 2. Criar evento no Google Calendar
      const calendarEvent = await this.calendar.createCleaningEvent(cleaning);

      // 3. Criar Payment Intent no Stripe
      const paymentIntent = await this.stripe.createPaymentIntent(
        cleaning.price,
        "brl",
        {
          cleaningId: cleaning.id,
          propertyId: cleaning.propertyId,
        }
      );

      console.log("✅ Reserva processada com sucesso");

      return {
        cleaning,
        calendarEvent,
        paymentIntent,
      };
    } catch (error) {
      console.error("❌ Erro ao processar reserva:", error);
      throw error;
    }
  }

  // Sincronização completa de dados
  async fullSync() {
    try {
      console.log("🔄 Iniciando sincronização completa...");

      // 1. Sync Hostaway/Airbnb reservations
      const hostawaySync = await this.hostaway.syncAllReservations();

      // 2. Sync calendários
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
      });

      const calendarSyncs = await Promise.all(
        employees.map((emp) =>
          this.calendar.getEmployeeSchedule(emp.email, today, nextMonth)
        )
      );

      // 3. Verificar pagamentos pendentes
      const pendingPayments = await prisma.cleaning.findMany({
        where: { paid: false, status: "COMPLETED" },
      });

      for (const cleaning of pendingPayments) {
        // Criar cobrança automática se não existir
        await this.stripe.createPaymentIntent(cleaning.price, "brl", {
          cleaningId: cleaning.id,
        });
      }

      console.log("✅ Sincronização completa finalizada");

      return {
        hostawayReservations: hostawaySync.synced,
        employeesScheduled: calendarSyncs.length,
        pendingPayments: pendingPayments.length,
      };
    } catch (error) {
      console.error("❌ Erro na sincronização:", error);
      throw error;
    }
  }

  private calculatePrice(reservationData: any): number {
    // Lógica de preço baseada em vários fatores
    return 150; // Placeholder
  }
}
```

### 6. **APIs de Integração**

#### **A. Endpoint de sincronização:**

```typescript
// src/app/api/integrations/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { IntegrationOrchestrator } from "@/services/integrations/integration.orchestrator";

export async function POST(request: NextRequest) {
  try {
    const orchestrator = new IntegrationOrchestrator();
    const result = await orchestrator.fullSync();

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro na sincronização" },
      { status: 500 }
    );
  }
}
```

#### **B. Webhook Stripe:**

```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@/services/integrations/stripe.service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    const stripeService = new StripeService();
    const result = await stripeService.handleWebhook(payload, signature);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
```

---

## ✅ **Checklist de Implementação**

### **Airbnb:**

- [ ] Obter credenciais API
- [ ] Implementar client service
- [ ] Testar busca de propriedades
- [ ] Testar busca de reservas
- [ ] Implementar transformação de dados

### **Google Calendar:**

- [ ] Configurar OAuth2
- [ ] Implementar criação de eventos
- [ ] Testar sincronização de agenda
- [ ] Implementar eventos recorrentes

### **Stripe:**

- [ ] Configurar conta Stripe
- [ ] Implementar pagamentos
- [ ] Configurar webhooks
- [ ] Testar transferências

### **Hostaway:**

- [ ] Obter credenciais API
- [ ] Implementar sincronização
- [ ] Testar multi-plataforma
- [ ] Automatizar criação de limpezas

### **Orquestração:**

- [ ] Implementar orchestrator
- [ ] Criar APIs de sincronização
- [ ] Configurar cron jobs
- [ ] Testar fluxo completo

**Tempo estimado: 3-4 semanas** 🚀
