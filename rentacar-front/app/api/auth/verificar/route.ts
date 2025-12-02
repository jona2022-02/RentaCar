import { NextRequest, NextResponse } from 'next/server';
import { getUsuarioActual } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const usuario = await getUsuarioActual();

    if (!usuario) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { usuario },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return NextResponse.json(
      { error: 'Error al verificar sesión' },
      { status: 500 }
    );
  }
}
