// Componente para Sistema de Avaliação e Bonificação
'use client';

import React, { useState, useEffect } from 'react';
import { safeArray, safeGet, safeMath } from '@/utils/defensive';

interface Avaliacao {
  id: number;
  funcionario: string;
  cliente: string;
  data: string;
  nota: number;
  comentarios: string;
  local: string;
  supervisor: string;
}

interface FuncionarioPerformance {
  nome: string;
  mediaMensal: number;
  totalAvaliacoes: number;
  bonus: number;
  historico: Avaliacao[];
}

export default function SistemaAvaliacao() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([
    {
      id: 1,
      funcionario: 'Maria Silva',
      cliente: 'João Santos',
      data: '2024-10-08',
      nota: 5,
      comentarios: 'Excelente trabalho, muito caprichosa',
      local: 'Apartamento Centro',
      supervisor: 'Ana Costa'
    },
    {
      id: 2,
      funcionario: 'Pedro Oliveira',
      cliente: 'Empresa ABC',
      data: '2024-10-08',
      nota: 4,
      comentarios: 'Bom trabalho, pontual',
      local: 'Escritório Comercial',
      supervisor: 'Carlos Lima'
    },
    {
      id: 3,
      funcionario: 'Maria Silva',
      cliente: 'Casa Residencial',
      data: '2024-10-07',
      nota: 5,
      comentarios: 'Perfeito, cliente muito satisfeito',
      local: 'Casa Vila Madalena',
      supervisor: 'Ana Costa'
    }
  ]);

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    funcionario: '',
    cliente: '',
    nota: 5,
    comentarios: '',
    local: '',
    supervisor: ''
  });

  const funcionarios = ['Maria Silva', 'Pedro Oliveira', 'João Costa', 'Ana Santos'];
  const supervisores = ['Ana Costa', 'Carlos Lima', 'Roberto Silva'];

  const calcularPerformance = (): FuncionarioPerformance[] => {
    const performance: { [key: string]: FuncionarioPerformance } = {};

    safeArray.forEach(funcionarios, (funcionario) => {
      const avaliacoesFuncionario = safeArray.filter(avaliacoes, av => 
        safeGet.string(av?.funcionario) === funcionario
      );
      
      const validAvaliacoes = safeArray.filter(avaliacoesFuncionario, av => 
        typeof av?.nota === 'number' && !isNaN(av.nota)
      );
      
      const total = safeArray.reduce(validAvaliacoes, (sum, av) => sum + av.nota, 0);
      const media = validAvaliacoes.length > 0 
        ? safeMath.divide(total, validAvaliacoes.length, 0)
        : 0;
      
      let bonus = 0;
      if (media >= 4.8) bonus = 200;
      else if (media >= 4.5) bonus = 150;
      else if (media >= 4.0) bonus = 100;

      if (funcionario) {
        performance[funcionario] = {
          nome: funcionario,
          mediaMensal: Number(media.toFixed(2)),
          totalAvaliacoes: validAvaliacoes.length,
          bonus,
          historico: validAvaliacoes
        };
      }
    });

    return Object.values(performance);
  };

  const adicionarAvaliacao = () => {
    if (novaAvaliacao.funcionario && novaAvaliacao.cliente) {
      const nova: Avaliacao = {
        id: Date.now(),
        ...novaAvaliacao,
        data: new Date().toISOString().split('T')[0]
      };
      setAvaliacoes([...avaliacoes, nova]);
      setNovaAvaliacao({
        funcionario: '',
        cliente: '',
        nota: 5,
        comentarios: '',
        local: '',
        supervisor: ''
      });
    }
  };

  const renderEstrelas = (nota: number, readonly = true) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(estrela => (
          <button
            key={estrela}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && setNovaAvaliacao({...novaAvaliacao, nota: estrela})}
            className={`text-2xl ${
              estrela <= nota ? 'text-yellow-400' : 'text-gray-300'
            } ${!readonly ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const exportarPlanilha = () => {
    const performance = calcularPerformance();
    let csvContent = "Funcionário,Média Mensal,Total Avaliações,Bônus (R$)\n";
    
    safeArray.forEach(performance, (p) => {
      const nome = safeGet.string(p?.nome, 'N/A');
      const media = safeGet.number(p?.mediaMensal, 0);
      const total = safeGet.number(p?.totalAvaliacoes, 0);
      const bonus = safeGet.number(p?.bonus, 0);
      
      csvContent += `${nome},${media.toFixed(2)},${total},${bonus}\n`;
    });
    
    // Adicionar detalhes das avaliações
    csvContent += "\n\nDetalhes das Avaliações\n";
    csvContent += "Funcionário,Cliente,Data,Nota,Local,Supervisor,Comentários\n";
    
    safeArray.forEach(avaliacoes, (av) => {
      const funcionario = safeGet.string(av?.funcionario, 'N/A');
      const cliente = safeGet.string(av?.cliente, 'N/A');
      const data = safeGet.string(av?.data, 'N/A');
      const nota = safeGet.number(av?.nota, 0);
      const local = safeGet.string(av?.local, 'N/A');
      const supervisor = safeGet.string(av?.supervisor, 'N/A');
      const comentarios = safeGet.string(av?.comentarios, '').replace(/"/g, '""'); // Escape quotes
      
      csvContent += `${funcionario},${cliente},${data},${nota},${local},${supervisor},"${comentarios}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `avaliacao_equipe_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const performance = calcularPerformance();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sistema de Avaliação e Bonificação</h2>
        <button
          onClick={exportarPlanilha}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Exportar Planilha
        </button>
      </div>

      {/* Resumo de Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance da Equipe - Outubro 2024</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performance.map((p, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{p.nome}</h4>
              <div className="mt-2">
                {renderEstrelas(Math.round(p.mediaMensal))}
                <p className="text-sm text-gray-600 mt-1">
                  Média: {p.mediaMensal.toFixed(2)} ({p.totalAvaliacoes} avaliações)
                </p>
                <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  p.bonus >= 200 ? 'bg-green-100 text-green-700' :
                  p.bonus >= 150 ? 'bg-blue-100 text-blue-700' :
                  p.bonus >= 100 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  Bônus: R$ {p.bonus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nova Avaliação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Avaliação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Funcionário</label>
            <select
              value={novaAvaliacao.funcionario}
              onChange={(e) => setNovaAvaliacao({...novaAvaliacao, funcionario: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Selecione o funcionário</option>
              {funcionarios.map(func => (
                <option key={func} value={func}>{func}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
            <input
              type="text"
              value={novaAvaliacao.cliente}
              onChange={(e) => setNovaAvaliacao({...novaAvaliacao, cliente: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Nome do cliente"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
            <input
              type="text"
              value={novaAvaliacao.local}
              onChange={(e) => setNovaAvaliacao({...novaAvaliacao, local: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Local da limpeza"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
            <select
              value={novaAvaliacao.supervisor}
              onChange={(e) => setNovaAvaliacao({...novaAvaliacao, supervisor: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Selecione o supervisor</option>
              {supervisores.map(sup => (
                <option key={sup} value={sup}>{sup}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação</label>
            {renderEstrelas(novaAvaliacao.nota, false)}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comentários</label>
            <textarea
              value={novaAvaliacao.comentarios}
              onChange={(e) => setNovaAvaliacao({...novaAvaliacao, comentarios: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
              placeholder="Comentários sobre o trabalho realizado"
            />
          </div>
        </div>
        
        <button
          onClick={adicionarAvaliacao}
          className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Adicionar Avaliação
        </button>
      </div>

      {/* Histórico de Avaliações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Avaliações</h3>
        
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avaliação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentários
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeArray.map(avaliacoes, (avaliacao) => (
                <tr key={avaliacao.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {safeGet.string(avaliacao?.funcionario, 'N/A')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {safeGet.string(avaliacao?.cliente, 'N/A')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderEstrelas(avaliacao.nota)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {safeGet.string(avaliacao?.local, 'N/A')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {safeGet.string(avaliacao?.comentarios, 'N/A')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Visible on small screens */}
        <div className="lg:hidden space-y-4">
          {safeArray.map(avaliacoes, (avaliacao) => (
            <div key={avaliacao.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {safeGet.string(avaliacao?.funcionario, 'N/A')}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Cliente: {safeGet.string(avaliacao?.cliente, 'N/A')}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex justify-end">
                    {renderEstrelas(avaliacao.nota)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Local:</span>
                  <span className="text-gray-600 ml-2">{safeGet.string(avaliacao?.local, 'N/A')}</span>
                </div>
                
                {avaliacao.comentarios && (
                  <div>
                    <span className="font-medium text-gray-700">Comentários:</span>
                    <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                      {safeGet.string(avaliacao?.comentarios, 'N/A')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}