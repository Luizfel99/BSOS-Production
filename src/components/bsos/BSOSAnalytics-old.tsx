'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RelatoriosAutomaticos from '../RelatoriosAutomaticos';
import PainelAdministrativo from '../PainelAdministrativo';

// Component Icons
const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AIIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const TrendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const PredictionIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export default function BSOSAnalytics() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    {
      id: 'dashboard',
      name: 'AI Dashboard',
      icon: AnalyticsIcon,
      component: null
    },
    {
      id: 'insights',
      name: 'AI Insights',
      icon: AIIcon,
      component: null
    },
    {
      id: 'trends',
      name: 'Análise de Tendências',
      icon: TrendIcon,
      component: null
    },
    {
      id: 'alerts',
      name: 'Alertas Inteligentes',
      icon: AlertIcon,
      component: null
    },
    {
      id: 'predictions',
      name: 'Previsões',
      icon: PredictionIcon,
      component: null
    },
    {
      id: 'reports',
      name: 'Relatórios Executivos',
      icon: AnalyticsIcon,
      component: RelatoriosAutomaticos
    },
    {
      id: 'admin',
      name: 'Painel Executivo',
      icon: AnalyticsIcon,
      component: PainelAdministrativo
    }
  ];

  const AIInsightsComponent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">IA Recomenda</h3>
              <p className="text-blue-100 text-sm">Otimização de rotas</p>
            </div>
            <AIIcon />
          </div>
          <div className="mt-4">
            <p className="text-sm">
              Reagrupar as limpezas de Copacabana pode reduzir o tempo de deslocamento em 23% e economizar R$ 340/semana.
            </p>
            <button className="mt-3 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-30">
              Aplicar Sugestão
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Previsão IA</h3>
              <p className="text-green-100 text-sm">Demanda próximos 30 dias</p>
            </div>
            <PredictionIcon />
          </div>
          <div className="mt-4">
            <p className="text-sm">
              Esperado aumento de 18% na demanda durante Carnaval (fev 15-20). Recomendar contratar 2 funcionários temporários.
            </p>
            <button className="mt-3 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-30">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Insights de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <div className="text-sm text-gray-600">Eficiência da Equipe</div>
            <div className="text-xs text-green-600 mt-1">↗ +5% vs mês anterior</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">4.8⭐</div>
            <div className="text-sm text-gray-600">Satisfação Média</div>
            <div className="text-xs text-green-600 mt-1">↗ +0.2 vs mês anterior</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-sm text-gray-600">Taxa de Retenção</div>
            <div className="text-xs text-green-600 mt-1">↗ +3% vs mês anterior</div>
          </div>
        </div>
      </div>
    </div>
  );

  const TrendsComponent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tendências de Mercado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Zona Sul</h4>
                <p className="text-sm text-gray-600">Crescimento de demanda</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">+15%</div>
                <div className="text-xs text-gray-500">vs ano anterior</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Barra da Tijuca</h4>
                <p className="text-sm text-gray-600">Novos apartamentos</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">+23%</div>
                <div className="text-xs text-gray-500">oportunidades</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Centro</h4>
                <p className="text-sm text-gray-600">Estabilização</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-yellow-600">+2%</div>
                <div className="text-xs text-gray-500">crescimento lento</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600">Gráfico de Tendências</p>
              <p className="text-sm text-gray-500">Análise por região</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AlertsComponent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Alertas Ativos</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertIcon />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Funcionário em Atraso Crítico</h4>
                <p className="text-sm text-red-600">João Santos está 45min atrasado para Casa #123</p>
                <p className="text-xs text-red-500 mt-1">Cliente será notificado automaticamente em 15min</p>
              </div>
              <button className="text-red-600 text-sm hover:underline">Resolver</button>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertIcon />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">Estoque Baixo</h4>
                <p className="text-sm text-yellow-600">Produtos de limpeza abaixo do limite mínimo</p>
                <p className="text-xs text-yellow-500 mt-1">Desinfetante: 3 unidades restantes</p>
              </div>
              <button className="text-yellow-600 text-sm hover:underline">Comprar</button>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertIcon />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800">Oportunidade de Upsell</h4>
                <p className="text-sm text-blue-600">Cliente Maria Santos pode estar interessado em limpeza quinzenal</p>
                <p className="text-xs text-blue-500 mt-1">Baseado no padrão de reservas</p>
              </div>
              <button className="text-blue-600 text-sm hover:underline">Contatar</button>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <AlertIcon />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">Performance Excepcional</h4>
                <p className="text-sm text-green-600">Ana Costa completou 10 limpezas com 5⭐ consecutivas</p>
                <p className="text-xs text-green-500 mt-1">Elegível para bônus de performance</p>
              </div>
              <button className="text-green-600 text-sm hover:underline">Premiar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PredictionsComponent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Próximos 7 dias</h3>
            <PredictionIcon />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Limpezas previstas</span>
              <span className="font-medium">34</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Receita estimada</span>
              <span className="font-medium">R$ 8.450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Funcionários necessários</span>
              <span className="font-medium">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Próximos 30 dias</h3>
            <TrendIcon />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Crescimento esperado</span>
              <span className="font-medium text-green-600">+18%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Novos clientes</span>
              <span className="font-medium">12-15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Churn risk</span>
              <span className="font-medium text-red-600">2 clientes</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Trimestre</h3>
            <AnalyticsIcon />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Meta de receita</span>
              <span className="font-medium">R$ 150k</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Progresso atual</span>
              <span className="font-medium text-blue-600">67%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Probabilidade</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cenários de Planejamento</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Cenário Otimista 📈</h4>
            <p className="text-sm text-gray-600 mt-1">Crescimento de 25% com expansão para Zona Norte</p>
            <div className="mt-3 flex space-x-4 text-sm">
              <span className="text-green-600">Receita: R$ 195k</span>
              <span className="text-blue-600">Novos funcionários: 6</span>
              <span className="text-purple-600">ROI: 340%</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Cenário Realista 📊</h4>
            <p className="text-sm text-gray-600 mt-1">Crescimento orgânico de 15% mantendo qualidade</p>
            <div className="mt-3 flex space-x-4 text-sm">
              <span className="text-green-600">Receita: R$ 172k</span>
              <span className="text-blue-600">Novos funcionários: 3</span>
              <span className="text-purple-600">ROI: 280%</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Cenário Conservador 📉</h4>
            <p className="text-sm text-gray-600 mt-1">Crescimento de 8% focando em rentabilidade</p>
            <div className="mt-3 flex space-x-4 text-sm">
              <span className="text-green-600">Receita: R$ 162k</span>
              <span className="text-blue-600">Novos funcionários: 1</span>
              <span className="text-purple-600">ROI: 320%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Receita Total</p>
              <p className="text-2xl font-bold">R$ 127.5k</p>
            </div>
            <AnalyticsIcon />
          </div>
          <div className="mt-2">
            <span className="text-blue-100 text-sm">+23% vs trimestre anterior</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Margem de Lucro</p>
              <p className="text-2xl font-bold">67.3%</p>
            </div>
            <TrendIcon />
          </div>
          <div className="mt-2">
            <span className="text-green-100 text-sm">+4.2% vs meta</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">NPS Score</p>
              <p className="text-2xl font-bold">87</p>
            </div>
            <AIIcon />
          </div>
          <div className="mt-2">
            <span className="text-purple-100 text-sm">Promotores: 94%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Eficiência IA</p>
              <p className="text-2xl font-bold">94.2%</p>
            </div>
            <PredictionIcon />
          </div>
          <div className="mt-2">
            <span className="text-yellow-100 text-sm">Economia: R$ 12.4k</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Crescimento</p>
              <p className="text-2xl font-bold">+18.7%</p>
            </div>
            <TrendIcon />
          </div>
          <div className="mt-2">
            <span className="text-red-100 text-sm">MoM growth</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">🤖 Recomendações da IA</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800">Otimização de Rotas</h4>
              <p className="text-sm text-blue-600 mt-1">
                Reorganizar rotas pode economizar 2.3h/dia por equipe
              </p>
              <div className="mt-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Economia: R$ 1.2k/mês</span>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800">Expansão Sugerida</h4>
              <p className="text-sm text-green-600 mt-1">
                Zona Norte apresenta demanda não atendida de 34%
              </p>
              <div className="mt-3">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Potencial: R$ 18k/mês</span>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800">Retenção de Clientes</h4>
              <p className="text-sm text-purple-600 mt-1">
                3 clientes com risco de cancelamento identificados
              </p>
              <div className="mt-3">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Ação: Contato proativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Indicadores Estratégicos</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Customer Lifetime Value</span>
              <span className="font-semibold">R$ 3.240</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Custo de Aquisição (CAC)</span>
              <span className="font-semibold">R$ 180</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payback Period</span>
              <span className="font-semibold">2.1 meses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Market Share (Rio)</span>
              <span className="font-semibold">12.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Metas vs Realizado</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Receita Trimestral</span>
                <span>67% da meta</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Novos Clientes</span>
                <span>89% da meta</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>NPS Target</span>
                <span>108% da meta</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BSOS Analytics - AI Insights</h1>
            <p className="text-gray-600">Indicadores, alertas e previsões inteligentes para diretores e donos da empresa</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">IA processando dados</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === 'dashboard' && <AnalyticsDashboard />}
          {activeSection === 'insights' && <AIInsightsComponent />}
          {activeSection === 'trends' && <TrendsComponent />}
          {activeSection === 'alerts' && <AlertsComponent />}
          {activeSection === 'predictions' && <PredictionsComponent />}
          {sections.map((section) => {
            if (section.component && activeSection === section.id) {
              const Component = section.component;
              return <Component key={section.id} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
