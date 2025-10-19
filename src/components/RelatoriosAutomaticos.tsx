'use client';

import { useState, useEffect } from 'react';

interface RelatorioAuditoria {
  id: string;
  auditoriaId: string;
  imovel: string;
  funcionario: string;
  supervisor: string;
  dataAuditoria: string;
  pontuacaoGeral: number;
  areas: {
    nome: string;
    pontuacao: number;
    observacoes: string;
  }[];
  recomendacoes: string[];
  fotosAnexadas: number;
  tempoAuditoria: string;
  status: 'gerado' | 'aprovado' | 'pendente';
}

export default function RelatoriosAutomaticos() {
  const [relatorios, setRelatorios] = useState<RelatorioAuditoria[]>([]);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<RelatorioAuditoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    try {
      const response = await fetch('/api/relatorios');
      const data = await response.json();
      setRelatorios(data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const baixarPDF = async (relatorioId: string) => {
    try {
      // Simular download do PDF
      const link = document.createElement('a');
      link.href = `/api/relatorios/download/${relatorioId}.pdf`;
      link.download = `relatorio_auditoria_${relatorioId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'gerado': 'bg-gray-100 text-gray-800',
      'aprovado': 'bg-green-100 text-green-800',
      'pendente': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPontuacaoColor = (pontuacao: number) => {
    if (pontuacao >= 4.5) return 'text-green-700';
    if (pontuacao >= 3.5) return 'text-yellow-700';
    return 'text-red-700';
  };

  const relatoriosFiltrados = relatorios.filter(relatorio => 
    filtroStatus === 'todos' || relatorio.status === filtroStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Relatórios Automáticos de Auditoria</h2>
          <p className="text-sm text-gray-600 mt-1">Relatórios PDF gerados automaticamente após cada auditoria</p>
        </div>

        {/* Filtros */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por status:</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos</option>
              <option value="gerado">Gerado</option>
              <option value="aprovado">Aprovado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>

        {/* Lista de Relatórios */}
        <div className="divide-y divide-gray-200">
          {relatoriosFiltrados.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Nenhum relatório encontrado</p>
            </div>
          ) : (
            relatoriosFiltrados.map((relatorio) => (
              <div key={relatorio.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{relatorio.imovel}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(relatorio.status)}`}>
                        {relatorio.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Funcionário:</span> {relatorio.funcionario}
                      </div>
                      <div>
                        <span className="font-medium">Supervisor:</span> {relatorio.supervisor}
                      </div>
                      <div>
                        <span className="font-medium">Data:</span> {new Date(relatorio.dataAuditoria).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Duração:</span> {relatorio.tempoAuditoria}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Pontuação:</span>
                        <span className={`font-bold ${getPontuacaoColor(relatorio.pontuacaoGeral)}`}>
                          {relatorio.pontuacaoGeral.toFixed(1)}/5.0
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {relatorio.fotosAnexadas} fotos anexadas
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => setRelatorioSelecionado(relatorio)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={() => baixarPDF(relatorio.id)}
                      className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Baixar PDF
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Visualização do Relatório */}
      {relatorioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header do Modal */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Relatório de Auditoria - {relatorioSelecionado.imovel}
              </h3>
              <button
                onClick={() => setRelatorioSelecionado(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="px-6 py-4">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Informações da Auditoria</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Funcionário:</span> {relatorioSelecionado.funcionario}</div>
                    <div><span className="font-medium">Supervisor:</span> {relatorioSelecionado.supervisor}</div>
                    <div><span className="font-medium">Data:</span> {new Date(relatorioSelecionado.dataAuditoria).toLocaleString()}</div>
                    <div><span className="font-medium">Tempo de Auditoria:</span> {relatorioSelecionado.tempoAuditoria}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Pontuação Geral</h4>
                  <div className="text-3xl font-bold text-gray-900">
                    {relatorioSelecionado.pontuacaoGeral.toFixed(1)}/5.0
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(relatorioSelecionado.status)}`}>
                      {relatorioSelecionado.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pontuação por Área */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Pontuação por Área</h4>
                <div className="space-y-3">
                  {relatorioSelecionado.areas.map((area, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{area.nome}</h5>
                        <span className={`font-bold ${getPontuacaoColor(area.pontuacao)}`}>
                          {area.pontuacao}/5
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{area.observacoes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendações */}
              {relatorioSelecionado.recomendacoes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Recomendações</h4>
                  <ul className="space-y-2">
                    {relatorioSelecionado.recomendacoes.map((recomendacao, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{recomendacao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setRelatorioSelecionado(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => baixarPDF(relatorioSelecionado.id)}
                  className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Baixar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}