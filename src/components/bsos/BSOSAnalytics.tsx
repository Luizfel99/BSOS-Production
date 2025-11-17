"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces para o sistema de analytics
interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: "up" | "down" | "stable";
  category: "productivity" | "quality" | "time" | "revenue";
  insight: string;
}

interface AIPredict {
  id: string;
  type:
    | "deep_cleaning"
    | "stock_replenish"
    | "employee_replacement"
    | "maintenance";
  propertyId?: string;
  propertyName?: string;
  employeeId?: string;
  employeeName?: string;
  predictedDate: string;
  confidence: number;
  reasoning: string[];
  recommendations: string[];
  urgency: "low" | "medium" | "high" | "critical";
}

interface ExceptionAlert {
  id: string;
  type:
    | "complaints_repeat"
    | "delays_sequence"
    | "failures_pattern"
    | "rating_drop";
  severity: "warning" | "critical" | "urgent";
  entityId: string;
  entityName: string;
  entityType: "property" | "employee" | "service";
  description: string;
  frequency: number;
  lastOccurrence: string;
  trend: string;
  suggestedActions: string[];
}

interface IntelligentComparative {
  id: string;
  category:
    | "property_profitability"
    | "team_efficiency"
    | "rating_trends"
    | "cost_analysis";
  title: string;
  rankings: Array<{
    id: string;
    name: string;
    value: number;
    benchmark: number;
    performance: "excellent" | "good" | "average" | "poor";
    insights: string[];
  }>;
}

interface DynamicReport {
  id: string;
  type: "productivity" | "quality" | "time_analysis" | "revenue";
  title: string;
  period: string;
  data: Array<{
    label: string;
    value: number;
    target?: number;
    variance?: number;
  }>;
  insights: string[];
  recommendations: string[];
}

// Mock data para demonstração
const mockMetrics: AnalyticsMetric[] = [
  {
    id: "1",
    name: "Produtividade Média",
    value: 4.2,
    previousValue: 3.8,
    unit: "propriedades/dia",
    trend: "up",
    category: "productivity",
    insight: "Aumento de 10.5% na produtividade devido à otimização de rotas",
  },
  {
    id: "2",
    name: "Índice de Qualidade",
    value: 94.7,
    previousValue: 92.1,
    unit: "%",
    trend: "up",
    category: "quality",
    insight: "Melhoria significativa após implementação do novo protocolo",
  },
  {
    id: "3",
    name: "Tempo Médio por Serviço",
    value: 2.3,
    previousValue: 2.6,
    unit: "horas",
    trend: "down",
    category: "time",
    insight: "Redução de 11.5% no tempo médio mantendo qualidade",
  },
  {
    id: "4",
    name: "Receita por Propriedade",
    value: 387,
    previousValue: 352,
    unit: "R$/mês",
    trend: "up",
    category: "revenue",
    insight: "Crescimento de 9.9% na receita média por propriedade",
  },
];

const mockPredictions: AIPredict[] = [
  {
    id: "1",
    type: "deep_cleaning",
    propertyId: "prop_001",
    propertyName: "Apt Copacabana Premium",
    predictedDate: "2025-01-15T10:00:00",
    confidence: 87,
    reasoning: [
      "Última limpeza profunda há 8 semanas",
      "Acúmulo detectado em áreas de alto tráfego",
      "Padrão histórico indica necessidade",
    ],
    recommendations: [
      "Agendar para próxima semana",
      "Focar em banheiros e cozinha",
      "Considerar produtos especializados",
    ],
    urgency: "medium",
  },
  {
    id: "2",
    type: "stock_replenish",
    predictedDate: "2025-01-12T00:00:00",
    confidence: 94,
    reasoning: [
      "Consumo 23% acima da média",
      "Estoque atual dura apenas 5 dias",
      "Fornecedor tem prazo de 3 dias",
    ],
    recommendations: [
      "Fazer pedido hoje",
      "Aumentar estoque de segurança",
      "Revisar consumo anômalo",
    ],
    urgency: "high",
  },
  {
    id: "3",
    type: "employee_replacement",
    employeeId: "emp_003",
    employeeName: "Carlos Silva",
    predictedDate: "2025-02-01T00:00:00",
    confidence: 72,
    reasoning: [
      "Queda na performance (15%)",
      "Aumento em reclamações (3x)",
      "Padrão indica desmotivação",
    ],
    recommendations: [
      "Conversa de feedback imediata",
      "Programa de retreinamento",
      "Avaliar realocação de funções",
    ],
    urgency: "medium",
  },
];

const mockAlerts: ExceptionAlert[] = [
  {
    id: "1",
    type: "complaints_repeat",
    severity: "critical",
    entityId: "prop_002",
    entityName: "Casa Barra da Tijuca",
    entityType: "property",
    description: "Reclamações recorrentes sobre limpeza de vidros",
    frequency: 4,
    lastOccurrence: "2025-01-09T16:30:00",
    trend: "Aumentando (2x em 15 dias)",
    suggestedActions: [
      "Revisão do protocolo de limpeza de vidros",
      "Treinamento específico da equipe",
      "Substituição de produtos/equipamentos",
    ],
  },
  {
    id: "2",
    type: "delays_sequence",
    severity: "warning",
    entityId: "emp_002",
    entityName: "João Santos",
    entityType: "employee",
    description: "Sequência de 3 atrasos consecutivos",
    frequency: 3,
    lastOccurrence: "2025-01-10T09:45:00",
    trend: "Padrão emergente",
    suggestedActions: [
      "Conversa individual sobre horários",
      "Revisar rotas de deslocamento",
      "Verificar questões pessoais",
    ],
  },
  {
    id: "3",
    type: "rating_drop",
    severity: "urgent",
    entityId: "team_alpha",
    entityName: "Equipe Alpha",
    entityType: "service",
    description: "Queda de 4.8 para 3.9 na avaliação média",
    frequency: 5,
    lastOccurrence: "2025-01-10T18:00:00",
    trend: "Declínio acentuado (-18.8%)",
    suggestedActions: [
      "Auditoria imediata dos processos",
      "Feedback detalhado dos clientes",
      "Plano de melhoria urgente",
    ],
  },
];

const mockComparatives: IntelligentComparative[] = [
  {
    id: "1",
    category: "property_profitability",
    title: "Ranking de Rentabilidade por Propriedade",
    rankings: [
      {
        id: "prop_001",
        name: "Apt Copacabana Premium",
        value: 42.3,
        benchmark: 35.0,
        performance: "excellent",
        insights: ["ROI 20% acima da média", "Cliente fidelizado há 18 meses"],
      },
      {
        id: "prop_002",
        name: "Casa Barra da Tijuca",
        value: 38.7,
        benchmark: 35.0,
        performance: "good",
        insights: ["Margem sólida", "Potencial para otimização"],
      },
      {
        id: "prop_003",
        name: "Apt Ipanema Vista Mar",
        value: 28.2,
        benchmark: 35.0,
        performance: "poor",
        insights: ["Custos elevados", "Necessita revisão de preços"],
      },
    ],
  },
  {
    id: "2",
    category: "team_efficiency",
    title: "Eficiência por Equipe",
    rankings: [
      {
        id: "team_alpha",
        name: "Equipe Alpha",
        value: 96.4,
        benchmark: 90.0,
        performance: "excellent",
        insights: ["Líder em produtividade", "Baixo índice de retrabalho"],
      },
      {
        id: "team_beta",
        name: "Equipe Beta",
        value: 89.7,
        benchmark: 90.0,
        performance: "average",
        insights: ["Performance consistente", "Oportunidade de melhoria"],
      },
    ],
  },
];

const mockReports: DynamicReport[] = [
  {
    id: "1",
    type: "productivity",
    title: "Análise de Produtividade Semanal",
    period: "Última Semana",
    data: [
      { label: "Segunda", value: 4.1, target: 4.0, variance: 2.5 },
      { label: "Terça", value: 4.3, target: 4.0, variance: 7.5 },
      { label: "Quarta", value: 3.8, target: 4.0, variance: -5.0 },
      { label: "Quinta", value: 4.5, target: 4.0, variance: 12.5 },
      { label: "Sexta", value: 4.2, target: 4.0, variance: 5.0 },
    ],
    insights: [
      "Quinta-feira apresenta pico de produtividade",
      "Quarta-feira consistentemente abaixo da meta",
      "Média semanal 2.5% acima do objetivo",
    ],
    recommendations: [
      "Investigar fatores da queda nas quartas",
      "Replicar práticas de quinta-feira",
      "Considerar redistribuição de carga",
    ],
  },
];

export default function BSOSAnalytics() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAlert, setSelectedAlert] = useState<ExceptionAlert | null>(
    null,
  );

  // AI Dashboard Principal
  const AIDashboard = () => (
    <div className="space-y-6">
      {/* AI Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mockMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    metric.category === "productivity"
                      ? "bg-green-100"
                      : metric.category === "quality"
                        ? "bg-blue-100"
                        : metric.category === "time"
                          ? "bg-yellow-100"
                          : "bg-purple-100"
                  }`}
                >
                  {metric.category === "productivity"
                    ? "⚡"
                    : metric.category === "quality"
                      ? "⭐"
                      : metric.category === "time"
                        ? "⏱️"
                        : "💰"}
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  metric.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : metric.trend === "down"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {metric.trend === "up"
                  ? "📈"
                  : metric.trend === "down"
                    ? "📉"
                    : "➡️"}
              </span>
            </div>
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metric.value} {metric.unit}
              </p>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              vs anterior: {metric.previousValue} {metric.unit}
              <span
                className={`ml-2 ${
                  metric.trend === "up"
                    ? "text-green-600"
                    : metric.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                (
                {(
                  ((metric.value - metric.previousValue) /
                    metric.previousValue) *
                  100
                ).toFixed(1)}
                %)
              </span>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-xs text-gray-700">🧠 AI Insight:</p>
              <p className="text-xs text-gray-600 mt-1">{metric.insight}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Predictions Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            🔮 Previsões AI - Próximos 30 Dias
          </h3>
          <p className="text-sm text-gray-600">
            Inteligência artificial antecipa necessidades
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        prediction.urgency === "critical"
                          ? "bg-red-100"
                          : prediction.urgency === "high"
                            ? "bg-orange-100"
                            : prediction.urgency === "medium"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                      }`}
                    >
                      {prediction.type === "deep_cleaning"
                        ? "🧽"
                        : prediction.type === "stock_replenish"
                          ? "📦"
                          : prediction.type === "employee_replacement"
                            ? "👤"
                            : "🔧"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {prediction.type === "deep_cleaning"
                          ? "Limpeza Profunda Necessária"
                          : prediction.type === "stock_replenish"
                            ? "Reposição de Estoque"
                            : prediction.type === "employee_replacement"
                              ? "Atenção com Funcionário"
                              : "Manutenção Preventiva"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {prediction.propertyName ||
                          prediction.employeeName ||
                          "Geral"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prediction.urgency === "critical"
                          ? "bg-red-100 text-red-800"
                          : prediction.urgency === "high"
                            ? "bg-orange-100 text-orange-800"
                            : prediction.urgency === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {prediction.urgency === "critical"
                        ? "🚨 Crítico"
                        : prediction.urgency === "high"
                          ? "⚠️ Alto"
                          : prediction.urgency === "medium"
                            ? "📊 Médio"
                            : "💡 Baixo"}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(prediction.predictedDate).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                    <div className="text-xs text-blue-600">
                      {prediction.confidence}% confiança
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      🧠 Raciocínio AI:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {prediction.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      💡 Recomendações:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                    Agendar Ação
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">
                    Dispensar
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                    Mais Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              🎯 Top Insights AI
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Oportunidade Identificada
                  </p>
                  <p className="text-xs text-green-700">
                    Propriedades em Copacabana têm 23% mais rentabilidade.
                    Considere expandir nesta região.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">📊</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Padrão Detectado
                  </p>
                  <p className="text-xs text-blue-700">
                    Serviços de quinta-feira são 15% mais eficientes. Otimizar
                    agenda baseada neste padrão.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">🔄</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900">
                    Automação Sugerida
                  </p>
                  <p className="text-xs text-purple-700">
                    71% dos reagendamentos acontecem por chuva. Implementar
                    sistema preditivo meteorológico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              🎲 Previsão de Demanda
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">Próxima Semana</p>
                  <p className="text-sm text-gray-600">11-17 Janeiro</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">34</p>
                  <p className="text-xs text-gray-500">serviços previstos</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">Fim do Mês</p>
                  <p className="text-sm text-gray-600">25-31 Janeiro</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">42</p>
                  <p className="text-xs text-gray-500">pico de demanda</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded p-3">
                <p className="text-sm font-medium text-yellow-900">
                  ⚡ AI Recomenda:
                </p>
                <p className="text-xs text-yellow-700">
                  Contratar temporário para última semana do mês. ROI estimado:
                  +18%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Relatórios Dinâmicos
  const DynamicReports = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          📈 Relatórios Dinâmicos
        </h3>
        <p className="text-sm text-gray-600">
          Análises automáticas de produtividade, qualidade e performance
        </p>
      </div>

      <div className="space-y-6">
        {mockReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {report.title}
                  </h4>
                  <p className="text-sm text-gray-600">{report.period}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  📊 Exportar
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-4">
                    📊 Dados do Período
                  </h5>
                  <div className="space-y-3">
                    {report.data.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <span className="font-medium">{item.label}</span>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.value}</div>
                          {item.target && (
                            <div
                              className={`text-xs ${
                                item.variance && item.variance > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.variance && item.variance > 0 ? "+" : ""}
                              {item.variance?.toFixed(1)}% vs meta
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-4">
                    🧠 Insights AI
                  </h5>
                  <div className="space-y-3 mb-6">
                    {report.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">💡</span>
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>

                  <h5 className="font-medium text-gray-900 mb-4">
                    🎯 Recomendações
                  </h5>
                  <div className="space-y-3">
                    {report.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">→</span>
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Alertas de Exceção
  const ExceptionAlerts = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          🚨 Alertas de Exceção
        </h3>
        <p className="text-sm text-gray-600">
          Detecção automática de padrões anômalos e problemas recorrentes
        </p>
      </div>

      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-6 shadow ${
              alert.severity === "critical"
                ? "border-red-500 bg-red-50"
                : alert.severity === "urgent"
                  ? "border-orange-500 bg-orange-50"
                  : "border-yellow-500 bg-yellow-50"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert.severity === "critical"
                      ? "bg-red-100"
                      : alert.severity === "urgent"
                        ? "bg-orange-100"
                        : "bg-yellow-100"
                  }`}
                >
                  {alert.type === "complaints_repeat"
                    ? "📢"
                    : alert.type === "delays_sequence"
                      ? "⏰"
                      : alert.type === "failures_pattern"
                        ? "❌"
                        : "📉"}
                </div>
                <div>
                  <h4
                    className={`font-semibold ${
                      alert.severity === "critical"
                        ? "text-red-900"
                        : alert.severity === "urgent"
                          ? "text-orange-900"
                          : "text-yellow-900"
                    }`}
                  >
                    {alert.type === "complaints_repeat"
                      ? "Reclamações Recorrentes"
                      : alert.type === "delays_sequence"
                        ? "Padrão de Atrasos"
                        : alert.type === "failures_pattern"
                          ? "Falhas em Sequência"
                          : "Queda de Avaliação"}
                  </h4>
                  <p
                    className={`text-sm ${
                      alert.severity === "critical"
                        ? "text-red-700"
                        : alert.severity === "urgent"
                          ? "text-orange-700"
                          : "text-yellow-700"
                    }`}
                  >
                    {alert.entityName} ({alert.entityType})
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.severity === "critical"
                    ? "bg-red-100 text-red-800"
                    : alert.severity === "urgent"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {alert.severity === "critical"
                  ? "🚨 Crítico"
                  : alert.severity === "urgent"
                    ? "⚠️ Urgente"
                    : "📊 Atenção"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {alert.frequency}
                </div>
                <div className="text-xs text-gray-600">Ocorrências</div>
              </div>
              <div className="text-center p-3 bg-white rounded">
                <div className="text-sm font-bold text-gray-900">
                  {new Date(alert.lastOccurrence).toLocaleDateString("pt-BR")}
                </div>
                <div className="text-xs text-gray-600">Última Ocorrência</div>
              </div>
              <div className="text-center p-3 bg-white rounded">
                <div className="text-sm font-bold text-gray-900">
                  {alert.trend}
                </div>
                <div className="text-xs text-gray-600">Tendência</div>
              </div>
            </div>

            <div className="bg-white rounded p-4 mb-4">
              <p
                className={`text-sm ${
                  alert.severity === "critical"
                    ? "text-red-800"
                    : alert.severity === "urgent"
                      ? "text-orange-800"
                      : "text-yellow-800"
                }`}
              >
                <strong>Descrição:</strong> {alert.description}
              </p>
            </div>

            <div className="mb-4">
              <h5
                className={`font-medium mb-2 ${
                  alert.severity === "critical"
                    ? "text-red-900"
                    : alert.severity === "urgent"
                      ? "text-orange-900"
                      : "text-yellow-900"
                }`}
              >
                🎯 Ações Sugeridas pela AI:
              </h5>
              <ul className="space-y-1">
                {alert.suggestedActions.map((action, index) => (
                  <li
                    key={index}
                    className={`text-sm flex items-start ${
                      alert.severity === "critical"
                        ? "text-red-700"
                        : alert.severity === "urgent"
                          ? "text-orange-700"
                          : "text-yellow-700"
                    }`}
                  >
                    <span className="mr-2">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                Investigar
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                Plano de Ação
              </button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">
                Marcar Resolvido
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Comparativos Inteligentes
  const IntelligentComparatives = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          🧩 Comparativos Inteligentes
        </h3>
        <p className="text-sm text-gray-600">
          Rankings e análises comparativas para otimização estratégica
        </p>
      </div>

      <div className="space-y-6">
        {mockComparatives.map((comparative) => (
          <div key={comparative.id} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">
                {comparative.title}
              </h4>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {comparative.rankings.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-400"
                                : "bg-blue-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {item.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Benchmark: {item.benchmark}% | Performance:{" "}
                          <span
                            className={`font-medium ${
                              item.performance === "excellent"
                                ? "text-green-600"
                                : item.performance === "good"
                                  ? "text-blue-600"
                                  : item.performance === "average"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                          >
                            {item.performance === "excellent"
                              ? "Excelente"
                              : item.performance === "good"
                                ? "Boa"
                                : item.performance === "average"
                                  ? "Média"
                                  : "Ruim"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {item.value}%
                      </div>
                      <div
                        className={`text-sm ${
                          item.value > item.benchmark
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.value > item.benchmark ? "+" : ""}
                        {(item.value - item.benchmark).toFixed(1)}% vs benchmark
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">
                  🧠 Insights AI:
                </h5>
                <div className="space-y-1">
                  {comparative.rankings[0]?.insights.map((insight, index) => (
                    <p key={index} className="text-sm text-blue-800">
                      • {insight}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: "dashboard", name: "AI Dashboard", icon: "🧠" },
    { id: "reports", name: "Relatórios Dinâmicos", icon: "📈" },
    { id: "alerts", name: "Alertas de Exceção", icon: "🚨" },
    { id: "comparatives", name: "Comparativos Inteligentes", icon: "🧩" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              🧠 BSOS Analytics - AI Insights
            </h1>
            <p className="text-indigo-100">
              Transformando dados em decisões inteligentes com Inteligência
              Artificial
            </p>
            <div className="mt-4 flex items-center space-x-6 text-indigo-100">
              <span>📊 94.7% qualidade média</span>
              <span>⚡ 4.2 propriedades/dia</span>
              <span>🎯 3 previsões ativas</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">AI Engine</div>
            <div className="text-indigo-100">Status: Ativo</div>
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
                    ? "border-indigo-500 text-indigo-600"
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
          {activeTab === "dashboard" && <AIDashboard />}
          {activeTab === "reports" && <DynamicReports />}
          {activeTab === "alerts" && <ExceptionAlerts />}
          {activeTab === "comparatives" && <IntelligentComparatives />}
        </div>
      </div>
    </div>
  );
}
