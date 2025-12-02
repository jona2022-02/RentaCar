import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getUsuarioActual } from '@/lib/auth';

// PUT /api/usuarios/:id/password - Cambiar contraseña
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

    const { id } = params;

    // Solo puede cambiar su propia contraseña (o ADMIN puede cambiar la de otros)
    if (usuarioActual.rol !== 'ADMIN' && usuarioActual.id !== id) {
      return NextResponse.json(
        { error: 'No tienes permisos para cambiar esta contraseña' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { passwordActual, passwordNueva } = body;

    if (!passwordNueva || passwordNueva.length < 6) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Obtener usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Si no es ADMIN, verificar contraseña actual
    if (usuarioActual.rol !== 'ADMIN') {
      if (!passwordActual) {
        return NextResponse.json(
          { error: 'Contraseña actual requerida' },
          { status: 400 }
        );
      }

      const passwordValida = await bcrypt.compare(passwordActual, usuario.password);

      if (!passwordValida) {
        return NextResponse.json(
          { error: 'Contraseña actual incorrecta' },
          { status: 400 }
        );
      }
    }

    // Encriptar nueva contraseña
    const passwordHash = await bcrypt.hash(passwordNueva, 10);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id },
      data: { password: passwordHash },
    });

    return NextResponse.json(
      { mensaje: 'Contraseña actualizada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    return NextResponse.json(
      { error: 'Error al cambiar contraseña' },
      { status: 500 }
    );
  }
}
