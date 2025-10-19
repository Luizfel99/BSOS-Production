'use client';

import { useState, useEffect } from 'react';

interface LimpezaItem {
  id: string;
  imovel: string;
  endereco: string;
  funcionario: string;
  horario: string;
  status: 'pendente' | 'em-andamento' | 'concluida' | 'auditoria';
  tipo: 'check-in' | 'check-out' | 'manutencao';
  prioridade: 'baixa' | 'media' | 'alta';
}

interface AuditoriaArea {
  id: string;
  nome: string;
  itens: string[];
  pontuacao: number;
  observacoes: string;
}

interface FotoAuditoria {
  id: string;
  limpezaId: string;
  area: string;
  antes: string;
  depois: string;
  aprovada: boolean | null;
  observacoes: string;
  timestamp: string;
}

interface HistoricoQualidade {
  imovel: string;
  funcionario: string;
  mediaQualidade: number;
  totalLimpezas: number;
  ultimaAvaliacao: string;
  tendencia: 'subindo' | 'estavel' | 'descendo';
}

export default function PainelSupervisor() {
  const [activeView, setActiveView] = useState('limpezas');
  const [limpezasDia, setLimpezasDia] = useState<LimpezaItem[]>([]);
  const [limpezasSemana, setLimpezasSemana] = useState<LimpezaItem[]>([]);
  const [auditoriaAtiva, setAuditoriaAtiva] = useState<string | null>(null);
  const [areasAuditoria, setAreasAuditoria] = useState<AuditoriaArea[]>([]);
  const [fotosRevisao, setFotosRevisao] = useState<FotoAuditoria[]>([]);
  const [historicoQualidade, setHistoricoQualidade] = useState<HistoricoQualidade[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await fetch('/api/supervisor');
      const data = await response.json();
      
      setLimpezasDia(data.limpezasDia);
      setLimpezasSemana(data.limpezasDia); // Para demo, usando os mesmos dados
      setFotosRevisao(data.fotosRevisao);
      setHistoricoQualidade(data.historicoQualidade);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const iniciarAuditoria = (limpezaId: string) => {
    setAuditoriaAtiva(limpezaId);
    const areas: AuditoriaArea[] = [
      {
        id: 'area1',
        nome: 'Sala de Estar',
        itens: ['Móveis limpos', 'Piso aspirado', 'Superfícies desenpoeiradas', 'Almofadas organizadas'],
        pontuacao: 0,
        observacoes: ''
      },
      {
        id: 'area2',
        nome: 'Cozinha',
        itens: ['Bancada limpa', 'Pia higienizada', 'Fogão limpo', 'Geladeira externa limpa'],
        pontuacao: 0,
        observacoes: ''
      },
      {
        id: 'area3',
        nome: 'Banheiro',
        itens: ['Vaso sanitário', 'Box do chuveiro', 'Pia e espelho', 'Piso e azulejos'],
        pontuacao: 0,
        observacoes: ''
      },
      {
        id: 'area4',
        nome: 'Quartos',
        itens: ['Cama arrumada', 'Piso limpo', 'Móveis organizados', 'Lixeiras vazias'],
        pontuacao: 0,
        observacoes: ''
      }
    ];
    setAreasAuditoria(areas);
    setActiveView('auditoria');
  };

  const atualizarPontuacaoArea = (areaId: string, pontuacao: number) => {
    setAreasAuditoria(prev => 
      prev.map(area => 
        area.id === areaId ? { ...area, pontuacao } : area
      )
    );
  };

  const atualizarObservacaoArea = (areaId: string, observacoes: string) => {
    setAreasAuditoria(prev => 
      prev.map(area => 
        area.id === areaId ? { ...area, observacoes } : area
      )
    );
  };

  const finalizarAuditoria = async () => {
    const pontuacaoMedia = areasAuditoria.reduce((acc, area) => acc + area.pontuacao, 0) / areasAuditoria.length;
    
    try {
      // Gerar relatório PDF
      const response = await fetch('/api/supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finalizar_auditoria',
          auditoriaId: auditoriaAtiva,
          pontuacao: pontuacaoMedia,
          areas: areasAuditoria
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Atualizar status da limpeza
        setLimpezasDia(prev => 
          prev.map(limpeza => 
            limpeza.id === auditoriaAtiva ? { ...limpeza, status: 'concluida' } : limpeza
          )
        );

        setAuditoriaAtiva(null);
        setActiveView('limpezas');
        alert('Auditoria finalizada e relatório gerado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao finalizar auditoria:', error);
      alert('Erro ao finalizar auditoria. Tente novamente.');
    }
  };

  const gerarRelatorioPDF = async (limpezaId: string, pontuacao: number, areas: AuditoriaArea[]) => {
    try {
      const response = await fetch('/api/supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'gerar_relatorio_pdf',
          auditoriaId: limpezaId,
          pontuacao,
          areas
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Simular download do PDF
        window.open(result.pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
    }
  };

  const aprovarFoto = async (fotoId: string, aprovada: boolean, observacoes: string = '') => {
    try {
      const response = await fetch('/api/supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'aprovar_foto',
          fotoId,
          aprovada,
          observacoes
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setFotosRevisao(prev => 
          prev.map(foto => 
            foto.id === fotoId ? { ...foto, aprovada, observacoes } : foto
          )
        );
      }
    } catch (error) {
      console.error('Erro ao aprovar/rejeitar foto:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pendente': 'text-gray-600 bg-gray-100',
      'em-andamento': 'text-blue-700 bg-blue-100',
      'auditoria': 'text-orange-700 bg-orange-100',
      'concluida': 'text-green-700 bg-green-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      'baixa': 'border-l-gray-400',
      'media': 'border-l-yellow-500',
      'alta': 'border-l-red-500'
    };
    return colors[prioridade as keyof typeof colors] || 'border-l-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Painel do Supervisor</h2>
          <p className="text-sm text-gray-600 mt-1">Gestão e auditoria de limpezas</p>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-1">
            {[
              { id: 'limpezas', label: 'Limpezas' },
              { id: 'fotos', label: 'Galeria Antes/Depois' },
              { id: 'qualidade', label: 'Histórico de Qualidade' },
              { id: 'auditoria', label: 'Auditoria Ativa' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-6 py-4 sm:px-4 sm:py-2 text-sm font-medium rounded-md transition-colors touch-target ${
                  activeView === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Limpezas View */}
          {activeView === 'limpezas' && (
            <div className="space-y-6">
              {/* Limpezas do Dia */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Limpezas de Hoje</h3>
                <div className="space-y-3">
                  {limpezasDia.map((limpeza) => (
                    <div key={limpeza.id} className={`bg-white border border-gray-200 rounded-lg p-4 border-l-4 ${getPrioridadeColor(limpeza.prioridade)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{limpeza.imovel}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(limpeza.status)}`}>
                              {limpeza.status.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{limpeza.endereco}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Funcionário: {limpeza.funcionario}</span>
                            <span>Horário: {limpeza.horario}</span>
                            <span>Tipo: {limpeza.tipo}</span>
                          </div>
                        </div>
                        <div className="ml-4 space-y-2">
                          {limpeza.status === 'concluida' && (
                            <button
                              onClick={() => iniciarAuditoria(limpeza.id)}
                              className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                              Iniciar Auditoria
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limpezas da Semana */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo da Semana</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{limpezasSemana.length}</div>
                    <div className="text-sm text-gray-600">Total de Limpezas</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-green-700">{limpezasSemana.filter(l => l.status === 'concluida').length}</div>
                    <div className="text-sm text-gray-600">Concluídas</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-blue-700">{limpezasSemana.filter(l => l.status === 'em-andamento').length}</div>
                    <div className="text-sm text-gray-600">Em Andamento</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-orange-700">{limpezasSemana.filter(l => l.status === 'auditoria').length}</div>
                    <div className="text-sm text-gray-600">Em Auditoria</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Galeria de Fotos */}
          {activeView === 'fotos' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Galeria Antes/Depois - Revisão</h3>
              <div className="space-y-6">
                {fotosRevisao.map((foto) => (
                  <div key={foto.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{foto.area}</h4>
                        <p className="text-sm text-gray-600">Limpeza: {foto.limpezaId}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(foto.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Antes</h5>
                        <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">Foto Antes</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Depois</h5>
                        <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">Foto Depois</span>
                        </div>
                      </div>
                    </div>

                    {foto.aprovada === null ? (
                      <div className="space-y-3">
                        <textarea
                          placeholder="Observações..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => aprovarFoto(foto.id, true, '')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => aprovarFoto(foto.id, false, '')}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                          >
                            Rejeitar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`p-3 rounded-md ${foto.aprovada ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className={`text-sm font-medium ${foto.aprovada ? 'text-green-800' : 'text-red-800'}`}>
                          {foto.aprovada ? 'Aprovado' : 'Rejeitado'}
                        </div>
                        {foto.observacoes && (
                          <div className={`text-sm mt-1 ${foto.aprovada ? 'text-green-700' : 'text-red-700'}`}>
                            {foto.observacoes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Histórico de Qualidade */}
          {activeView === 'qualidade' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Histórico de Qualidade</h3>
              
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Imóvel / Funcionário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Média de Qualidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total de Limpezas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última Avaliação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tendência
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historicoQualidade.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.imovel}</div>
                            <div className="text-sm text-gray-500">{item.funcionario}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{item.mediaQualidade.toFixed(1)}</div>
                            <div className="ml-2 flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= item.mediaQualidade ? 'text-gray-900' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.totalLimpezas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.ultimaAvaliacao).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.tendencia === 'subindo' ? 'bg-green-100 text-green-800' :
                            item.tendencia === 'estavel' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.tendencia === 'subindo' ? '↗ Subindo' :
                             item.tendencia === 'estavel' ? '→ Estável' :
                             '↘ Descendo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {historicoQualidade.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.imovel}</h4>
                        <p className="text-sm text-gray-500">{item.funcionario}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.tendencia === 'subindo' ? 'bg-green-100 text-green-800' :
                        item.tendencia === 'estavel' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.tendencia === 'subindo' ? '↗ Subindo' :
                         item.tendencia === 'estavel' ? '→ Estável' :
                         '↘ Descendo'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Qualidade:</span>
                        <div className="flex items-center mt-1">
                          <span className="font-medium text-gray-900 mr-2">{item.mediaQualidade.toFixed(1)}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= item.mediaQualidade ? 'text-gray-900' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <p className="font-medium text-gray-900">{item.totalLimpezas} limpezas</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Última avaliação: {new Date(item.ultimaAvaliacao).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auditoria Ativa */}
          {activeView === 'auditoria' && auditoriaAtiva && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Auditoria em Andamento</h3>
                <div className="text-sm text-gray-600">
                  Limpeza: {auditoriaAtiva}
                </div>
              </div>

              <div className="space-y-6">
                {areasAuditoria.map((area) => (
                  <div key={area.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">{area.nome}</h4>
                    
                    <div className="space-y-3 mb-4">
                      {area.itens.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pontuação (1-5)
                        </label>
                        <select
                          value={area.pontuacao}
                          onChange={(e) => atualizarPontuacaoArea(area.id, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value={0}>Selecionar</option>
                          <option value={1}>1 - Muito Ruim</option>
                          <option value={2}>2 - Ruim</option>
                          <option value={3}>3 - Regular</option>
                          <option value={4}>4 - Bom</option>
                          <option value={5}>5 - Excelente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações
                        </label>
                        <textarea
                          value={area.observacoes}
                          onChange={(e) => atualizarObservacaoArea(area.id, e.target.value)}
                          placeholder="Observações sobre esta área..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Pontuação Média: {areasAuditoria.length > 0 ? 
                    (areasAuditoria.reduce((acc, area) => acc + area.pontuacao, 0) / areasAuditoria.length).toFixed(1) : 
                    '0.0'
                  }
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => setActiveView('limpezas')}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={finalizarAuditoria}
                    disabled={areasAuditoria.some(area => area.pontuacao === 0)}
                    className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Finalizar Auditoria
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}