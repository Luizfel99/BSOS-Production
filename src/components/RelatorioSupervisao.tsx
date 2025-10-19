// Componente para Relatório de Supervisão e Auditoria
'use client';

import { useState } from 'react';

interface FotoAnexo {
  id: string;
  nome: string;
  url: string;
  ambiente: string;
}

interface AvaliacaoAmbiente {
  ambiente: string;
  pontuacao: number;
  observacoes: string;
  fotos: FotoAnexo[];
}

interface RelatorioAuditoria {
  id: string;
  data: string;
  local: string;
  responsavel: string;
  supervisor: string;
  avaliacoes: AvaliacaoAmbiente[];
  observacoesGerais: string;
  assinaturaDigital: string;
  status: 'pendente' | 'aprovado' | 'correcao';
  pontuacaoTotal: number;
}

export default function RelatorioSupervisao() {
  const [relatorios, setRelatorios] = useState<RelatorioAuditoria[]>([
    {
      id: '1',
      data: '2024-10-08',
      local: 'Apartamento Centro - Rua das Flores, 123',
      responsavel: 'Maria Silva',
      supervisor: 'Ana Costa',
      avaliacoes: [
        {
          ambiente: 'Sala de Estar',
          pontuacao: 9,
          observacoes: 'Excelente limpeza, móveis bem organizados',
          fotos: []
        },
        {
          ambiente: 'Cozinha',
          pontuacao: 8,
          observacoes: 'Boa limpeza, atenção nos detalhes do fogão',
          fotos: []
        },
        {
          ambiente: 'Banheiro',
          pontuacao: 10,
          observacoes: 'Perfeito, sanitários impecáveis',
          fotos: []
        }
      ],
      observacoesGerais: 'Trabalho de alta qualidade, cliente muito satisfeito',
      assinaturaDigital: 'Ana Costa - 08/10/2024 14:30',
      status: 'aprovado',
      pontuacaoTotal: 9.0
    }
  ]);

  const [novoRelatorio, setNovoRelatorio] = useState({
    local: '',
    responsavel: '',
    supervisor: '',
    observacoesGerais: ''
  });

  const [avaliacaoAtual, setAvaliacaoAtual] = useState<AvaliacaoAmbiente>({
    ambiente: '',
    pontuacao: 10,
    observacoes: '',
    fotos: []
  });

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoAmbiente[]>([]);
  const [mostrarNovoFormulario, setMostrarNovoFormulario] = useState(false);

  const ambientes = [
    'Sala de Estar', 'Cozinha', 'Banheiro', 'Quarto 1', 'Quarto 2', 
    'Área de Serviço', 'Varanda', 'Escritório', 'Despensa', 'Lavabo'
  ];

  const funcionarios = ['Maria Silva', 'Pedro Oliveira', 'João Costa', 'Ana Santos'];
  const supervisores = ['Ana Costa', 'Carlos Lima', 'Roberto Silva'];

  const adicionarAvaliacao = () => {
    if (avaliacaoAtual.ambiente) {
      setAvaliacoes([...avaliacoes, { ...avaliacaoAtual, fotos: [] }]);
      setAvaliacaoAtual({
        ambiente: '',
        pontuacao: 10,
        observacoes: '',
        fotos: []
      });
    }
  };

  const removerAvaliacao = (index: number) => {
    setAvaliacoes(avaliacoes.filter((_, i) => i !== index));
  };

  const calcularPontuacaoTotal = (avaliacoesList: AvaliacaoAmbiente[]) => {
    if (avaliacoesList.length === 0) return 0;
    const soma = avaliacoesList.reduce((acc, av) => acc + av.pontuacao, 0);
    return soma / avaliacoesList.length;
  };

  const salvarRelatorio = () => {
    if (novoRelatorio.local && novoRelatorio.responsavel && novoRelatorio.supervisor && avaliacoes.length > 0) {
      const pontuacaoTotal = calcularPontuacaoTotal(avaliacoes);
      const status: 'pendente' | 'aprovado' | 'correcao' = 
        pontuacaoTotal >= 9 ? 'aprovado' : 
        pontuacaoTotal >= 7 ? 'pendente' : 'correcao';

      const novoRel: RelatorioAuditoria = {
        id: Date.now().toString(),
        data: new Date().toISOString().split('T')[0],
        ...novoRelatorio,
        avaliacoes: [...avaliacoes],
        assinaturaDigital: `${novoRelatorio.supervisor} - ${new Date().toLocaleString('pt-BR')}`,
        status,
        pontuacaoTotal
      };

      setRelatorios([novoRel, ...relatorios]);
      
      // Reset form
      setNovoRelatorio({ local: '', responsavel: '', supervisor: '', observacoesGerais: '' });
      setAvaliacoes([]);
      setMostrarNovoFormulario(false);
    }
  };

  const exportarRelatorio = (relatorio: RelatorioAuditoria) => {
    let content = `RELATÓRIO DE SUPERVISÃO E AUDITORIA DE QUALIDADE\n`;
    content += `Bright & Shine - Padrão de Excelência\n\n`;
    content += `Data: ${new Date(relatorio.data).toLocaleDateString('pt-BR')}\n`;
    content += `Local: ${relatorio.local}\n`;
    content += `Responsável: ${relatorio.responsavel}\n`;
    content += `Supervisor: ${relatorio.supervisor}\n`;
    content += `Pontuação Total: ${relatorio.pontuacaoTotal.toFixed(1)}/10\n`;
    content += `Status: ${relatorio.status.toUpperCase()}\n\n`;
    
    content += `AVALIAÇÃO POR AMBIENTE:\n`;
    content += `${'='.repeat(50)}\n`;
    
    relatorio.avaliacoes.forEach(av => {
      content += `\n${av.ambiente}: ${av.pontuacao}/10\n`;
      content += `Observações: ${av.observacoes}\n`;
    });
    
    content += `\nOBSERVAÇÕES GERAIS:\n`;
    content += `${relatorio.observacoesGerais}\n\n`;
    content += `ASSINATURA DIGITAL:\n`;
    content += `${relatorio.assinaturaDigital}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_auditoria_${relatorio.id}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-700';
      case 'pendente': return 'bg-yellow-100 text-yellow-700';
      case 'correcao': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'correcao': return 'Correção Necessária';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Relatório de Supervisão e Auditoria</h2>
        <button
          onClick={() => setMostrarNovoFormulario(!mostrarNovoFormulario)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          {mostrarNovoFormulario ? 'Cancelar' : 'Novo Relatório'}
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total de Auditorias</h3>
          <p className="text-2xl font-bold text-gray-900">{relatorios.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Aprovados</h3>
          <p className="text-2xl font-bold text-green-600">
            {relatorios.filter(r => r.status === 'aprovado').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {relatorios.filter(r => r.status === 'pendente').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Média Geral</h3>
          <p className="text-2xl font-bold text-blue-600">
            {relatorios.length > 0 
              ? (relatorios.reduce((acc, r) => acc + r.pontuacaoTotal, 0) / relatorios.length).toFixed(1)
              : '0.0'
            }/10
          </p>
        </div>
      </div>

      {/* Formulário Novo Relatório */}
      {mostrarNovoFormulario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Relatório de Auditoria</h3>
          
          {/* Dados Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
              <input
                type="text"
                value={novoRelatorio.local}
                onChange={(e) => setNovoRelatorio({...novoRelatorio, local: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Endereço completo do local"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsável pela Limpeza</label>
              <select
                value={novoRelatorio.responsavel}
                onChange={(e) => setNovoRelatorio({...novoRelatorio, responsavel: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Selecione o funcionário</option>
                {funcionarios.map(func => (
                  <option key={func} value={func}>{func}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
              <select
                value={novoRelatorio.supervisor}
                onChange={(e) => setNovoRelatorio({...novoRelatorio, supervisor: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Selecione o supervisor</option>
                {supervisores.map(sup => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Avaliação por Ambiente */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Avaliação por Ambiente</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ambiente</label>
                <select
                  value={avaliacaoAtual.ambiente}
                  onChange={(e) => setAvaliacaoAtual({...avaliacaoAtual, ambiente: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione o ambiente</option>
                  {ambientes.filter(amb => !avaliacoes.some(av => av.ambiente === amb)).map(amb => (
                    <option key={amb} value={amb}>{amb}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pontuação (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={avaliacaoAtual.pontuacao}
                  onChange={(e) => setAvaliacaoAtual({...avaliacaoAtual, pontuacao: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <input
                  type="text"
                  value={avaliacaoAtual.observacoes}
                  onChange={(e) => setAvaliacaoAtual({...avaliacaoAtual, observacoes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Observações sobre este ambiente"
                />
              </div>
            </div>
            
            <button
              onClick={adicionarAvaliacao}
              disabled={!avaliacaoAtual.ambiente}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Adicionar Avaliação
            </button>
          </div>

          {/* Lista de Avaliações */}
          {avaliacoes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Ambientes Avaliados</h4>
              <div className="space-y-2">
                {avaliacoes.map((av, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{av.ambiente}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        av.pontuacao >= 9 ? 'bg-green-100 text-green-700' :
                        av.pontuacao >= 7 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {av.pontuacao}/10
                      </span>
                      {av.observacoes && (
                        <p className="text-sm text-gray-600 mt-1">{av.observacoes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removerAvaliacao(index)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Pontuação Média: {calcularPontuacaoTotal(avaliacoes).toFixed(1)}/10
                </p>
              </div>
            </div>
          )}

          {/* Observações Gerais */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
            <textarea
              value={novoRelatorio.observacoesGerais}
              onChange={(e) => setNovoRelatorio({...novoRelatorio, observacoesGerais: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
              placeholder="Observações gerais sobre o trabalho realizado"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={salvarRelatorio}
              disabled={!novoRelatorio.local || !novoRelatorio.responsavel || !novoRelatorio.supervisor || avaliacoes.length === 0}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
            >
              Salvar Relatório
            </button>
            <button
              onClick={() => setMostrarNovoFormulario(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Relatórios */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Relatórios</h3>
          <div className="space-y-4">
            {relatorios.map((relatorio) => (
              <div key={relatorio.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{relatorio.local}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(relatorio.data).toLocaleDateString('pt-BR')} | 
                      Responsável: {relatorio.responsavel} | 
                      Supervisor: {relatorio.supervisor}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(relatorio.status)}`}>
                      {getStatusText(relatorio.status)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {relatorio.pontuacaoTotal.toFixed(1)}/10
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                  {relatorio.avaliacoes.map((av, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{av.ambiente}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          av.pontuacao >= 9 ? 'bg-green-100 text-green-700' :
                          av.pontuacao >= 7 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {av.pontuacao}/10
                        </span>
                      </div>
                      {av.observacoes && (
                        <p className="text-xs text-gray-600 mt-1">{av.observacoes}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {relatorio.observacoesGerais && (
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-700">{relatorio.observacoesGerais}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Assinatura: {relatorio.assinaturaDigital}</span>
                  <button
                    onClick={() => exportarRelatorio(relatorio)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Exportar Relatório
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}