"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces para o sistema de clientes
interface Property {
  id: string;
  name: string;
  address: string;
  type: "apartment" | "house" | "commercial";
  size: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  lastCleaning: string;
  nextCleaning: string;
  cleaningFrequency: "daily" | "weekly" | "bi-weekly" | "monthly";
  status: "clean" | "scheduled" | "in-progress" | "completed" | "audited";
  rating: number;
  totalCleanings: number;
  photos: {
    before: string[];
    after: string[];
    timestamp: string;
  }[];
}

interface CleaningService {
  id: string;
  propertyId: string;
  propertyName: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  status: "scheduled" | "in-progress" | "completed" | "audited";
  type: "normal" | "deep" | "move-out" | "inspection";
  assignedCleaner: string;
  duration: number;
  checklist: {
    total: number;
    completed: number;
    items: Array<{
      category: string;
      task: string;
      completed: boolean;
      notes?: string;
    }>;
  };
  photos: {
    before: string[];
    after: string[];
    details: string[];
  };
  report: {
    summary: string;
    issues: string[];
    recommendations: string[];
    rating: number;
  };
  invoice: {
    amount: number;
    status: "pending" | "paid" | "overdue";
    dueDate: string;
    pdfUrl?: string;
  };
}

interface InventoryItem {
  id: string;
  name: string;
  category: "linens" | "towels" | "amenities" | "supplies";
  currentStock: number;
  minimumStock: number;
  unit: string;
  lastRestocked: string;
  autoReorder: boolean;
  cost: number;
  supplier: string;
}

interface ClientMessage {
  id: string;
  propertyId: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "manager" | "supervisor" | "cleaner";
  message: string;
  timestamp: string;
  type: "text" | "photo" | "report";
  read: boolean;
  attachments?: string[];
}

// Mock data para demonstração
const mockProperties: Property[] = [
  {
    id: "1",
    name: "Apartamento Copacabana Premium",
    address: "Av. Atlântica, 1234 - Apt 501",
    type: "apartment",
    size: 120,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Wi-Fi", "AC", "TV", "Kitchen", "Balcony"],
    lastCleaning: "2025-01-06T14:00:00",
    nextCleaning: "2025-01-08T10:00:00",
    cleaningFrequency: "weekly",
    status: "audited",
    rating: 4.8,
    totalCleanings: 24,
    photos: [
      {
        before: ["/photos/apt1-before1.jpg", "/photos/apt1-before2.jpg"],
        after: ["/photos/apt1-after1.jpg", "/photos/apt1-after2.jpg"],
        timestamp: "2025-01-06T14:00:00",
      },
    ],
  },
  {
    id: "2",
    name: "Casa Barra da Tijuca",
    address: "Rua das Américas, 500",
    type: "house",
    size: 300,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["Pool", "Garden", "Garage", "BBQ Area"],
    lastCleaning: "2025-01-05T09:00:00",
    nextCleaning: "2025-01-10T09:00:00",
    cleaningFrequency: "bi-weekly",
    status: "completed",
    rating: 4.9,
    totalCleanings: 18,
    photos: [
      {
        before: ["/photos/house1-before1.jpg"],
        after: ["/photos/house1-after1.jpg"],
        timestamp: "2025-01-05T09:00:00",
      },
    ],
  },
];

const mockCleaningServices: CleaningService[] = [
  {
    id: "1",
    propertyId: "1",
    propertyName: "Apartamento Copacabana Premium",
    scheduledDate: "2025-01-08T10:00:00",
    startTime: "2025-01-08T10:15:00",
    endTime: "2025-01-08T12:30:00",
    status: "completed",
    type: "normal",
    assignedCleaner: "Maria Silva",
    duration: 135,
    checklist: {
      total: 15,
      completed: 15,
      items: [
        { category: "Quartos", task: "Trocar roupa de cama", completed: true },
        { category: "Banheiros", task: "Limpar e desinfetar", completed: true },
        { category: "Cozinha", task: "Limpeza completa", completed: true },
      ],
    },
    photos: {
      before: [
        "/photos/cleaning1-before1.jpg",
        "/photos/cleaning1-before2.jpg",
      ],
      after: ["/photos/cleaning1-after1.jpg", "/photos/cleaning1-after2.jpg"],
      details: ["/photos/cleaning1-detail1.jpg"],
    },
    report: {
      summary:
        "Limpeza realizada com excelência. Todas as áreas foram tratadas conforme protocolo.",
      issues: [],
      recommendations: ["Considerar troca do filtro do AC em breve"],
      rating: 5.0,
    },
    invoice: {
      amount: 180,
      status: "paid",
      dueDate: "2025-01-15T00:00:00",
      pdfUrl: "/invoices/invoice-001.pdf",
    },
  },
  {
    id: "2",
    propertyId: "2",
    propertyName: "Casa Barra da Tijuca",
    scheduledDate: "2025-01-10T09:00:00",
    status: "scheduled",
    type: "deep",
    assignedCleaner: "João Santos",
    duration: 240,
    checklist: {
      total: 25,
      completed: 0,
      items: [],
    },
    photos: {
      before: [],
      after: [],
      details: [],
    },
    report: {
      summary: "",
      issues: [],
      recommendations: [],
      rating: 0,
    },
    invoice: {
      amount: 350,
      status: "pending",
      dueDate: "2025-01-17T00:00:00",
    },
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Lençóis Premium",
    category: "linens",
    currentStock: 12,
    minimumStock: 6,
    unit: "conjuntos",
    lastRestocked: "2025-01-01T00:00:00",
    autoReorder: true,
    cost: 150,
    supplier: "Têxtil Hotelaria",
  },
  {
    id: "2",
    name: "Toalhas de Banho",
    category: "towels",
    currentStock: 4,
    minimumStock: 8,
    unit: "peças",
    lastRestocked: "2024-12-15T00:00:00",
    autoReorder: true,
    cost: 45,
    supplier: "Casa & Banho",
  },
  {
    id: "3",
    name: "Shampoo & Condicionador",
    category: "amenities",
    currentStock: 15,
    minimumStock: 10,
    unit: "frascos",
    lastRestocked: "2025-01-05T00:00:00",
    autoReorder: true,
    cost: 25,
    supplier: "Amenities Premium",
  },
];

export default function BSOSClient() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [selectedService, setSelectedService] =
    useState<CleaningService | null>(null);

  // Portal Dashboard para Clientes
  const ClientDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-2">
          Bem-vindo ao seu Portal, {user?.name}! 👋
        </h2>
        <p className="text-purple-700">
          Acompanhe suas propriedades e serviços de limpeza com transparência
          total
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                🏠
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Propriedades</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockProperties.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                ✅
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Limpezas Este Mês
              </p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                ⭐
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Avaliação Média
              </p>
              <p className="text-2xl font-semibold text-gray-900">4.9</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Fatura Pendente
              </p>
              <p className="text-2xl font-semibold text-gray-900">R$ 350</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Portfolio */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            🏠 Seu Portfólio de Propriedades
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProperties.map((property) => (
              <div
                key={property.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">
                        {property.type === "apartment"
                          ? "🏢"
                          : property.type === "house"
                            ? "🏠"
                            : "🏢"}
                      </span>
                      <h4 className="font-semibold text-gray-900">
                        {property.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {property.address}
                    </p>

                    <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold">{property.size}m²</div>
                        <div className="text-gray-600 text-xs">Área</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold">{property.bedrooms}</div>
                        <div className="text-gray-600 text-xs">Quartos</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold">
                          {property.bathrooms}
                        </div>
                        <div className="text-gray-600 text-xs">Banheiros</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === "audited"
                            ? "bg-green-100 text-green-800"
                            : property.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : property.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : property.status === "scheduled"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {property.status === "audited"
                          ? "Auditada"
                          : property.status === "completed"
                            ? "Finalizada"
                            : property.status === "in-progress"
                              ? "Em Andamento"
                              : property.status === "scheduled"
                                ? "Agendada"
                                : "Limpa"}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{property.rating}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <p>
                        🗓️ Próxima limpeza:{" "}
                        {new Date(property.nextCleaning).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                      <p>📊 Total de limpezas: {property.totalCleanings}</p>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          +{property.amenities.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ver Detalhes
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Agendar Limpeza
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            🧹 Serviços Recentes
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockCleaningServices.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {service.propertyName}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>
                      📅{" "}
                      {new Date(service.scheduledDate).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                    <span>👤 {service.assignedCleaner}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : service.status === "scheduled"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {service.status === "completed"
                        ? "Finalizada"
                        : service.status === "scheduled"
                          ? "Agendada"
                          : "Em Andamento"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(service)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Ver Relatório
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Status em Tempo Real
  const RealTimeStatus = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            📊 Status em Tempo Real
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              Atualização Automática
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mockCleaningServices.map((service) => (
              <div key={service.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {service.propertyName}
                    </h4>
                    <p className="text-gray-600">
                      {service.type === "normal"
                        ? "🧹 Limpeza Normal"
                        : service.type === "deep"
                          ? "🧽 Limpeza Profunda"
                          : service.type === "move-out"
                            ? "📦 Move-out"
                            : "🔍 Inspeção"}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      service.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : service.status === "audited"
                          ? "bg-blue-100 text-blue-800"
                          : service.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {service.status === "completed"
                      ? "✅ Finalizada"
                      : service.status === "audited"
                        ? "👁️ Auditada"
                        : service.status === "in-progress"
                          ? "⚡ Em Andamento"
                          : "📅 Agendada"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Date(service.scheduledDate).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Data Agendada</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {service.duration}min
                    </div>
                    <div className="text-sm text-gray-600">Duração</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {service.assignedCleaner}
                    </div>
                    <div className="text-sm text-gray-600">Responsável</div>
                  </div>
                </div>

                {/* Progress Bars */}
                {service.status !== "scheduled" && (
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso do Checklist</span>
                        <span>
                          {service.checklist.completed}/
                          {service.checklist.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(service.checklist.completed / service.checklist.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fotos Documentadas</span>
                        <span>
                          {service.photos.before.length +
                            service.photos.after.length +
                            service.photos.details.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Timeline do Serviço
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm">
                        Agendamento confirmado -{" "}
                        {new Date(service.scheduledDate).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                    {service.startTime && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-sm">
                          Início da limpeza -{" "}
                          {new Date(service.startTime).toLocaleTimeString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    )}
                    {service.endTime && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-sm">
                          Finalizada -{" "}
                          {new Date(service.endTime).toLocaleTimeString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    )}
                    {service.status === "scheduled" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">
                          Aguardando início
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 sm:px-4 sm:py-2 rounded-lg text-sm font-medium touch-target">
                    Ver Fotos
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 sm:px-4 sm:py-2 rounded-lg text-sm font-medium touch-target">
                    Enviar Mensagem
                  </button>
                  {service.status === "completed" && (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 sm:px-4 sm:py-2 rounded-lg text-sm font-medium touch-target">
                      Baixar Relatório
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Galeria de Fotos e Relatórios
  const PhotoGalleryReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            📸 Galeria de Fotos e Relatórios
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mockCleaningServices
              .filter((s) => s.status === "completed")
              .map((service) => (
                <div key={service.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {service.propertyName}
                      </h4>
                      <p className="text-gray-600">
                        {new Date(service.scheduledDate).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">
                        {service.report.rating}
                      </span>
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-900 mb-3">
                      Documentação Fotográfica
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          Antes (Before)
                        </h6>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                            >
                              <span className="text-gray-400">📷</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          Depois (After)
                        </h6>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="aspect-square bg-green-100 rounded-lg flex items-center justify-center"
                            >
                              <span className="text-green-500">✨</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          Detalhes
                        </h6>
                        <div className="grid grid-cols-2 gap-2">
                          {[1].map((i) => (
                            <div
                              key={i}
                              className="aspect-square bg-blue-100 rounded-lg flex items-center justify-center"
                            >
                              <span className="text-blue-500">🔍</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Summary */}
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-green-900 mb-2">
                      📋 Resumo do Relatório
                    </h5>
                    <p className="text-green-800 text-sm">
                      {service.report.summary}
                    </p>

                    {service.report.recommendations.length > 0 && (
                      <div className="mt-3">
                        <h6 className="font-medium text-green-900 mb-1">
                          Recomendações:
                        </h6>
                        <ul className="text-green-800 text-sm">
                          {service.report.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Invoice */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-blue-900">💰 Fatura</h5>
                        <p className="text-blue-800">
                          R$ {service.invoice.amount} -{" "}
                          {service.invoice.status === "paid"
                            ? "Pago"
                            : service.invoice.status === "pending"
                              ? "Pendente"
                              : "Vencido"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          📄 Download PDF
                        </button>
                        {service.invoice.status === "pending" && (
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            💳 Pagar Agora
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Canal de Comunicação Direto
  const DirectCommunication = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            💬 Canal Direto de Comunicação
          </h3>
          <p className="text-sm text-gray-600">
            Comunicação monitorada com sua equipe de limpeza
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property/Service Selection */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-gray-900 mb-3">
                Selecione a Propriedade
              </h4>
              <div className="space-y-2">
                {mockProperties.map((property) => (
                  <button
                    key={property.id}
                    className="w-full text-left p-3 rounded-lg border hover:border-purple-500 hover:bg-purple-50 transition-colors"
                  >
                    <div className="font-medium text-sm">{property.name}</div>
                    <div className="text-xs text-gray-600">
                      {property.address}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          property.status === "audited"
                            ? "bg-green-500"
                            : property.status === "completed"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      ></span>
                      <span className="text-xs text-gray-500">
                        3 mensagens não lidas
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg h-96 flex flex-col">
                <div className="px-4 py-3 border-b bg-purple-50 rounded-t-lg">
                  <h4 className="font-medium">
                    Apartamento Copacabana Premium
                  </h4>
                  <p className="text-sm text-gray-600">
                    Chat com Maria Silva (Responsável pela limpeza) • Monitorado
                    por Ana Costa (Supervisora)
                  </p>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">👩‍💼</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm">
                            Olá! Iniciei a limpeza do seu apartamento. Tudo está
                            conforme o planejado.
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Maria - Hoje 10:15
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 justify-end">
                      <div className="flex-1">
                        <div className="bg-purple-500 text-white rounded-lg p-3 ml-12">
                          <p className="text-sm">
                            Perfeito! Obrigado pela comunicação. Pode dar
                            atenção especial ao banheiro principal?
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          Você - Hoje 10:18
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">👩‍💼</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm">
                            Claro! Vou dar atenção especial ao banheiro
                            principal. Estou enviando algumas fotos do
                            progresso.
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="aspect-square bg-blue-100 rounded flex items-center justify-center text-xs">
                              📷 Foto 1
                            </div>
                            <div className="aspect-square bg-blue-100 rounded flex items-center justify-center text-xs">
                              📷 Foto 2
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Maria - Hoje 10:45
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-blue-700">
                        💁‍♀️ <strong>Ana Costa (Supervisora)</strong> está
                        monitorando esta conversa para garantir a qualidade do
                        serviço
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
                      Enviar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    🔒 Todas as mensagens são monitoradas pela supervisão para
                    garantir qualidade e profissionalismo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Invoices e Pagamentos
  const InvoicesPayments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            💳 Invoices e Pagamentos Automáticos
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mockCleaningServices.map((service) => (
              <div key={service.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {service.propertyName}
                    </h4>
                    <p className="text-gray-600">
                      {service.type === "normal"
                        ? "Limpeza Normal"
                        : service.type === "deep"
                          ? "Limpeza Profunda"
                          : service.type === "move-out"
                            ? "Move-out"
                            : "Inspeção"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Serviço realizado em{" "}
                      {new Date(service.scheduledDate).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.invoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : service.invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.invoice.status === "paid"
                      ? "✅ Pago"
                      : service.invoice.status === "pending"
                        ? "⏳ Pendente"
                        : "🔴 Vencido"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {service.invoice.amount}
                    </div>
                    <div className="text-sm text-gray-600">Valor Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {new Date(service.invoice.dueDate).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Vencimento</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      Stripe
                    </div>
                    <div className="text-sm text-gray-600">Método</div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    📄 Detalhes da Fatura
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Limpeza base ({service.duration} min)</span>
                      <span>
                        R$ {(service.invoice.amount * 0.8).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Produtos especiais</span>
                      <span>
                        R$ {(service.invoice.amount * 0.1).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de serviço</span>
                      <span>
                        R$ {(service.invoice.amount * 0.1).toFixed(0)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>R$ {service.invoice.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    📄 Download PDF
                  </button>
                  {service.invoice.status === "pending" && (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      💳 Pagar com Stripe
                    </button>
                  )}
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    🔄 Configurar Auto-pagamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Controle de Inventário
  const InventoryControl = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            📦 Controle de Inventário
          </h3>
          <p className="text-sm text-gray-600">
            Gestão automática de toalhas, lençóis e amenities
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                📊 Status do Estoque
              </h4>
              <div className="space-y-4">
                {mockInventory.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {item.name}
                        </h5>
                        <p className="text-sm text-gray-600 capitalize">
                          {item.category}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.currentStock <= item.minimumStock
                            ? "bg-red-100 text-red-800"
                            : item.currentStock <= item.minimumStock * 1.5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.currentStock <= item.minimumStock
                          ? "🔴 Baixo"
                          : item.currentStock <= item.minimumStock * 1.5
                            ? "🟡 Atenção"
                            : "🟢 OK"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-600">
                          {item.currentStock}
                        </div>
                        <div className="text-gray-600 text-xs">Atual</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-semibold text-yellow-600">
                          {item.minimumStock}
                        </div>
                        <div className="text-gray-600 text-xs">Mínimo</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-600">
                          R$ {item.cost}
                        </div>
                        <div className="text-gray-600 text-xs">Custo</div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>Fornecedor: {item.supplier}</span>
                      <span>
                        Auto-reposição:{" "}
                        {item.autoReorder ? "✅ Ativa" : "❌ Inativa"}
                      </span>
                    </div>

                    {/* Stock Level Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Nível do Estoque</span>
                        <span>
                          {Math.round(
                            (item.currentStock / (item.minimumStock * 2)) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            item.currentStock <= item.minimumStock
                              ? "bg-red-500"
                              : item.currentStock <= item.minimumStock * 1.5
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min((item.currentStock / (item.minimumStock * 2)) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {item.currentStock <= item.minimumStock && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-red-800 text-sm font-medium">
                          🚨 Estoque baixo! Reposição recomendada
                        </p>
                        <p className="text-red-700 text-xs mt-1">
                          Última reposição:{" "}
                          {new Date(item.lastRestocked).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-Reorder Settings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                🔄 Reposição Automática
              </h4>
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h5 className="font-medium text-green-900 mb-2">
                  ✅ Sistema Ativo
                </h5>
                <p className="text-green-800 text-sm mb-3">
                  A reposição automática está configurada para manter seus
                  estoques sempre em dia
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Verificação:</span>
                    <span className="font-medium">Semanal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fornecedores ativos:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Próxima verificação:</span>
                    <span className="font-medium">Segunda-feira</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    📋 Pedidos Pendentes
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <div>
                        <p className="font-medium">Toalhas de Banho</p>
                        <p className="text-sm text-gray-600">
                          8 unidades - Casa & Banho
                        </p>
                      </div>
                      <span className="text-yellow-600 text-sm font-medium">
                        Pendente
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    📈 Histórico de Consumo
                  </h5>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Janeiro 2025:</span>
                      <span>R$ 450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dezembro 2024:</span>
                      <span>R$ 320</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Novembro 2024:</span>
                      <span>R$ 280</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium">
                  ⚙️ Configurar Reposição
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "dashboard", name: "Portal Dashboard", icon: "🌐" },
    { id: "status", name: "Status Tempo Real", icon: "🏠" },
    { id: "gallery", name: "Fotos & Relatórios", icon: "📸" },
    { id: "communication", name: "Canal Direto", icon: "💬" },
    { id: "invoices", name: "Invoices & Pagamentos", icon: "🧾" },
    { id: "inventory", name: "Controle Inventário", icon: "📦" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              🏠 BSOS Client - Transparency Portal
            </h1>
            <p className="text-purple-100">
              Transparência total e confiança para hosts e property managers
            </p>
            <div className="mt-4 flex items-center space-x-6 text-purple-100">
              <span>🏠 {mockProperties.length} propriedades</span>
              <span>
                ✅{" "}
                {
                  mockCleaningServices.filter((s) => s.status === "completed")
                    .length
                }{" "}
                limpezas este mês
              </span>
              <span>⭐ 4.9 avaliação média</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-purple-100">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "dashboard" && <ClientDashboard />}
          {activeTab === "status" && <RealTimeStatus />}
          {activeTab === "gallery" && <PhotoGalleryReports />}
          {activeTab === "communication" && <DirectCommunication />}
          {activeTab === "invoices" && <InvoicesPayments />}
          {activeTab === "inventory" && <InventoryControl />}
        </div>
      </div>
    </div>
  );
}
