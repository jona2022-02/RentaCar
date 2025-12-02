import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getUsuarioActual } from '@/lib/auth';

// POST /api/usuarios - Crear usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nombre, apellido, telefono, direccion, ciudad, rol } = body;

    // Validar campos requeridos
    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Validar contraseña mínima
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        password: passwordHash,
        nombre,
        apellido: apellido || null,
        telefono: telefono || null,
        direccion: direccion || null,
        ciudad: ciudad || null,
        rol: rol === 'ADMIN' ? 'ADMIN' : 'CLIENTE',
        estado: 'ACTIVO',
      },
    });

    return NextResponse.json(
      {
        usuario: {
          id: nuevoUsuario.id,
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre,
          apellido: nuevoUsuario.apellido,
          telefono: nuevoUsuario.telefono,
          direccion: nuevoUsuario.direccion,
          ciudad: nuevoUsuario.ciudad,
          rol: nuevoUsuario.rol,
          estado: nuevoUsuario.estado,
        },
        mensaje: 'Usuario creado exitosamente',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

// GET /api/usuarios - Listar todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const usuarioActual = await getUsuarioActual();

    if (!usuarioActual) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Solo ADMIN puede ver todos los usuarios
    if (usuarioActual.rol !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permisos para ver usuarios' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rol = searchParams.get('rol');
    const estado = searchParams.get('estado');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    if (rol) where.rol = rol;
    if (estado) where.estado = estado;

    // Obtener usuarios con paginación
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: { nombre: 'asc' },
      }),
      prisma.usuario.count({ where }),
    ]);

    return NextResponse.json(
      {
        usuarios,
        total,
        pagina: page,
        totalPaginas: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}
