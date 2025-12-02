import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getUsuarioActual } from '@/lib/auth';

// GET /api/usuarios/:id - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuarioActual = await getUsuarioActual();

    if (!usuarioActual) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Solo ADMIN puede ver otros usuarios, usuarios pueden ver su propio perfil
    if (usuarioActual.rol !== 'ADMIN' && usuarioActual.id !== id) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver este usuario' },
        { status: 403 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        direccion: true,
        ciudad: true,
        rol: true,
        estado: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ usuario }, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

// PUT /api/usuarios/:id - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioActual = await getUsuarioActual();

    if (!usuarioActual) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nombre, apellido, telefono, direccion, ciudad, rol, estado } = body;

    // Solo ADMIN puede actualizar otros usuarios
    if (usuarioActual.rol !== 'ADMIN' && usuarioActual.id !== id) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar este usuario' },
        { status: 403 }
      );
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Construir datos a actualizar
    const datosActualizar: any = {};
    if (nombre !== undefined) datosActualizar.nombre = nombre;
    if (apellido !== undefined) datosActualizar.apellido = apellido;
    if (telefono !== undefined) datosActualizar.telefono = telefono;
    if (direccion !== undefined) datosActualizar.direccion = direccion;
    if (ciudad !== undefined) datosActualizar.ciudad = ciudad;

    // Solo ADMIN puede cambiar rol y estado
    if (usuarioActual.rol === 'ADMIN') {
      if (rol !== undefined) datosActualizar.rol = rol;
      if (estado !== undefined) datosActualizar.estado = estado;
    }

    // Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: datosActualizar,
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        direccion: true,
        ciudad: true,
        rol: true,
        estado: true,
      },
    });

    return NextResponse.json(
      {
        usuario: usuarioActualizado,
        mensaje: 'Usuario actualizado exitosamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

// DELETE /api/usuarios/:id - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioActual = await getUsuarioActual();

    if (!usuarioActual) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Solo ADMIN puede eliminar usuarios
    if (usuarioActual.rol !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar usuarios' },
        { status: 403 }
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

    // No permitir que el usuario se elimine a sí mismo
    if (usuarioActual.id === id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      );
    }

    // Eliminar usuario
    await prisma.usuario.delete({
      where: { id },
    });

    return NextResponse.json(
      { mensaje: 'Usuario eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
