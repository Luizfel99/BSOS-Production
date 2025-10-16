import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('photo') as File;
  const area = formData.get('area') as string;
  const type = formData.get('type') as string; // 'before' or 'after'
  
  if (!file) {
    return NextResponse.json(
      { success: false, message: 'Nenhuma foto foi enviada' },
      { status: 400 }
    );
  }

  // Simular upload da foto
  const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const photoUrl = `/uploads/photos/${photoId}.jpg`;

  // Mock response
  const uploadResult = {
    success: true,
    photoId: photoId,
    url: photoUrl,
    area: area,
    type: type,
    timestamp: new Date().toISOString(),
    fileSize: file.size,
    fileName: file.name,
    message: 'Foto enviada com sucesso'
  };

  return NextResponse.json(uploadResult);
}
