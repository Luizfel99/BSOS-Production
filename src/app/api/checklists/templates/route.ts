import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Mock data para templates de checklist
  const templates = [
    {
      id: 'template001',
      name: 'Checklist Apartamento Check-out',
      type: 'check-out',
      propertyType: 'apartment',
      items: [
        {
          id: 'item001',
          area: 'Sala de Estar',
          tasks: [
            'Aspirar/varrer o piso',
            'Limpar superfícies (mesa, aparador, TV)',
            'Organizar almofadas e mantas',
            'Limpar janelas (interno)',
            'Tirar o lixo'
          ]
        },
        {
          id: 'item002',
          area: 'Cozinha',
          tasks: [
            'Lavar louça e utensílios',
            'Limpar bancada e pia',
            'Limpar fogão e forno',
            'Limpar geladeira (externo)',
            'Varrer e passar pano no chão',
            'Tirar o lixo'
          ]
        },
        {
          id: 'item003',
          area: 'Banheiro',
          tasks: [
            'Limpar vaso sanitário',
            'Limpar box e azulejos',
            'Limpar pia e espelho',
            'Trocar toalhas',
            'Repor papel higiênico',
            'Varrer e passar pano'
          ]
        },
        {
          id: 'item004',
          area: 'Quartos',
          tasks: [
            'Trocar roupa de cama',
            'Aspirar/varrer o piso',
            'Limpar superfícies dos móveis',
            'Organizar objetos',
            'Limpar espelhos'
          ]
        }
      ],
      estimatedTime: 120,
      difficulty: 'medium'
    },
    {
      id: 'template002',
      name: 'Checklist Casa Check-in',
      type: 'check-in',
      propertyType: 'house',
      items: [
        {
          id: 'item005',
          area: 'Área Externa',
          tasks: [
            'Varrer entrada e varanda',
            'Limpar móveis externos',
            'Verificar iluminação externa',
            'Organizar área de lazer'
          ]
        },
        {
          id: 'item006',
          area: 'Sala de Estar',
          tasks: [
            'Aspirar piso e tapetes',
            'Limpar todas as superfícies',
            'Organizar decoração',
            'Verificar controles remotos',
            'Limpar janelas'
          ]
        }
      ],
      estimatedTime: 90,
      difficulty: 'easy'
    }
  ];

  return NextResponse.json(templates);
}
