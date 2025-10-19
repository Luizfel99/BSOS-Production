import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Mock data para o painel do supervisor
  const painelData = {
    limpezasDia: [
      {
        id: 'l001',
        imovel: 'Apartamento 204 - Copacabana',
        endereco: 'Rua Barata Ribeiro, 540',
        funcionario: 'Maria Silva',
        horario: '09:00',
        status: 'em-andamento',
        tipo: 'check-out',
        prioridade: 'alta'
      },
      {
        id: 'l002',
        imovel: 'Casa Ipanema Premium',
        endereco: 'Rua Visconde de Pirajá, 350',
        funcionario: 'João Santos',
        horario: '11:00',
        status: 'auditoria',
        tipo: 'check-in',
        prioridade: 'media'
      },
      {
        id: 'l003',
        imovel: 'Studio Leblon View',
        endereco: 'Av. Ataulfo de Paiva, 1200',
        funcionario: 'Ana Costa',
        horario: '14:00',
        status: 'pendente',
        tipo: 'manutencao',
        prioridade: 'baixa'
      },
      {
        id: 'l004',
        imovel: 'Cobertura Barra da Tijuca',
        endereco: 'Av. das Américas, 3000',
        funcionario: 'Carlos Lima',
        horario: '16:00',
        status: 'concluida',
        tipo: 'check-out',
        prioridade: 'alta'
      }
    ],
    fotosRevisao: [
      {
        id: 'f001',
        limpezaId: 'l001',
        area: 'Sala de Estar',
        antes: '/api/placeholder/400/300',
        depois: '/api/placeholder/400/300',
        aprovada: null,
        observacoes: '',
        timestamp: new Date().toISOString(),
        funcionario: 'Maria Silva'
      },
      {
        id: 'f002',
        limpezaId: 'l001',
        area: 'Cozinha',
        antes: '/api/placeholder/400/300',
        depois: '/api/placeholder/400/300',
        aprovada: true,
        observacoes: 'Excelente trabalho na bancada',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        funcionario: 'Maria Silva'
      },
      {
        id: 'f003',
        limpezaId: 'l002',
        area: 'Banheiro Master',
        antes: '/api/placeholder/400/300',
        depois: '/api/placeholder/400/300',
        aprovada: false,
        observacoes: 'Box precisa ser limpo novamente',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        funcionario: 'João Santos'
      }
    ],
    historicoQualidade: [
      {
        imovel: 'Apartamento 204 - Copacabana',
        funcionario: 'Maria Silva',
        mediaQualidade: 4.8,
        totalLimpezas: 45,
        ultimaAvaliacao: '2025-10-07',
        tendencia: 'subindo'
      },
      {
        imovel: 'Casa Ipanema Premium',
        funcionario: 'João Santos',
        mediaQualidade: 4.2,
        totalLimpezas: 32,
        ultimaAvaliacao: '2025-10-06',
        tendencia: 'estavel'
      },
      {
        imovel: 'Studio Leblon View',
        funcionario: 'Ana Costa',
        mediaQualidade: 3.9,
        totalLimpezas: 28,
        ultimaAvaliacao: '2025-10-05',
        tendencia: 'descendo'
      },
      {
        imovel: 'Cobertura Barra da Tijuca',
        funcionario: 'Carlos Lima',
        mediaQualidade: 4.6,
        totalLimpezas: 38,
        ultimaAvaliacao: '2025-10-07',
        tendencia: 'subindo'
      },
      {
        imovel: 'Apartamento Lagoa',
        funcionario: 'Fernanda Oliveira',
        mediaQualidade: 4.1,
        totalLimpezas: 25,
        ultimaAvaliacao: '2025-10-06',
        tendencia: 'estavel'
      }
    ],
    relatoriosRecentes: [
      {
        id: 'r001',
        limpezaId: 'l004',
        imovel: 'Cobertura Barra da Tijuca',
        funcionario: 'Carlos Lima',
        pontuacaoMedia: 4.6,
        dataAuditoria: '2025-10-07T16:30:00Z',
        observacoes: 'Limpeza executada conforme padrão. Atenção especial nas janelas.',
        status: 'aprovado'
      },
      {
        id: 'r002',
        limpezaId: 'l002',
        imovel: 'Casa Ipanema Premium',
        funcionario: 'João Santos',
        pontuacaoMedia: 3.8,
        dataAuditoria: '2025-10-06T14:45:00Z',
        observacoes: 'Banheiro principal necessita melhoria. Demais áreas satisfatórias.',
        status: 'pendente'
      }
    ]
  };

  return NextResponse.json(painelData);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Simular diferentes ações do painel
  switch (body.action) {
    case 'finalizar_auditoria':
      return NextResponse.json({
        success: true,
        relatorioId: `rel_${Date.now()}`,
        message: 'Auditoria finalizada e relatório gerado com sucesso'
      });
      
    case 'aprovar_foto':
      return NextResponse.json({
        success: true,
        fotoId: body.fotoId,
        aprovada: body.aprovada,
        message: body.aprovada ? 'Foto aprovada' : 'Foto rejeitada'
      });
      
    case 'gerar_relatorio_pdf':
      return NextResponse.json({
        success: true,
        pdfUrl: `/api/relatorios/pdf/${body.auditoriaId}`,
        message: 'Relatório PDF gerado com sucesso'
      });
      
    default:
      return NextResponse.json({
        success: false,
        message: 'Ação não reconhecida'
      }, { status: 400 });
  }
}
