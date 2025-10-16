import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auditoriaId = searchParams.get('auditoriaId');
  
  // Mock data para relatórios
  const relatorios = [
    {
      id: 'rel001',
      auditoriaId: 'l001',
      imovel: 'Apartamento 204 - Copacabana',
      funcionario: 'Maria Silva',
      supervisor: 'Roberto Costa',
      dataAuditoria: '2025-10-08T16:30:00Z',
      pontuacaoGeral: 4.6,
      areas: [
        {
          nome: 'Sala de Estar',
          pontuacao: 5,
          observacoes: 'Excelente limpeza, todos os detalhes foram cuidados.'
        },
        {
          nome: 'Cozinha',
          pontuacao: 4,
          observacoes: 'Boa limpeza geral, bancada impecável.'
        },
        {
          nome: 'Banheiro',
          pontuacao: 5,
          observacoes: 'Sanitários higienizados conforme padrão.'
        },
        {
          nome: 'Quartos',
          pontuacao: 4,
          observacoes: 'Camas bem arrumadas, piso limpo.'
        }
      ],
      recomendacoes: [
        'Manter o padrão de qualidade atual',
        'Atenção especial na organização dos produtos de limpeza',
        'Continuar com o excelente trabalho'
      ],
      fotosAnexadas: 8,
      tempoAuditoria: '25 minutos',
      status: 'aprovado'
    }
  ];

  if (auditoriaId) {
    const relatorio = relatorios.find(r => r.auditoriaId === auditoriaId);
    if (relatorio) {
      return NextResponse.json(relatorio);
    } else {
      return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
    }
  }

  return NextResponse.json(relatorios);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Simular geração de relatório PDF
  if (body.action === 'gerar_pdf') {
    const relatorio = {
      id: `rel_${Date.now()}`,
      auditoriaId: body.auditoriaId,
      imovel: body.imovel,
      funcionario: body.funcionario,
      supervisor: 'Roberto Costa',
      dataAuditoria: new Date().toISOString(),
      pontuacaoGeral: body.pontuacao,
      areas: body.areas,
      recomendacoes: body.recomendacoes || [],
      fotosAnexadas: body.fotosAnexadas || 0,
      tempoAuditoria: body.tempoAuditoria || '20 minutos',
      status: 'gerado'
    };

    return NextResponse.json({
      success: true,
      relatorio,
      pdfUrl: `/api/relatorios/download/${relatorio.id}.pdf`,
      message: 'Relatório PDF gerado com sucesso'
    });
  }

  return NextResponse.json({
    success: false,
    message: 'Ação não reconhecida'
  }, { status: 400 });
}
