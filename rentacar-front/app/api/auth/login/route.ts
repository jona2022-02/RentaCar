import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar datos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar estado del usuario
    if (usuario.estado !== 'ACTIVO') {
      return NextResponse.json(
        { error: 'Usuario inactivo. Contacte al administrador' },
        { status: 403 }
      );
    }

    // Validar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Establecer cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set('usuario_id', usuario.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    // Retornar respuesta exitosa
    return NextResponse.json(
      {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
          estado: usuario.estado,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          ciudad: usuario.ciudad,
        },
        mensaje: 'Inicio de sesión exitoso',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
