import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUsuarioActual } from '@/lib/auth';

// PUT /api/usuarios/:id/estado - Cambiar estado del usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const usuarioActual = await getUsuarioActual();

    if (!usuarioActual) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Solo ADMIN puede cambiar estados
    if (usuarioActual.rol !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permisos para cambiar estados de usuario' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { estado } = body;

    if (!estado || !['ACTIVO', 'INACTIVO'].includes(estado)) {
      return NextResponse.json(
        { error: 'Estado inválido. Debe ser ACTIVO o INACTIVO' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // No permitir desactivar el propio usuario
    if (usuarioActual.id === id && estado === 'INACTIVO') {
      return NextResponse.json(
        { error: 'No puedes desactivar tu propia cuenta' },
        { status: 400 }
      );
    }

    // Actualizar estado
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { estado },
      select: {
        id: true,
        email: true,
        nombre: true,
        estado: true,
      },
    });

    return NextResponse.json(
      {
        usuario: usuarioActualizado,
        mensaje: 'Estado actualizado exitosamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cambiando estado:', error);
    return NextResponse.json(
      { error: 'Error al cambiar estado' },
      { status: 500 }
    );
  }
}
