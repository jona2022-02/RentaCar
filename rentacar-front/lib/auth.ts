import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function getUsuarioActual() {
  const cookieStore = await cookies();
  const usuarioId = cookieStore.get('usuario_id')?.value;

  if (!usuarioId) {
    return null;
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      email: true,
      nombre: true,
      apellido: true,
      telefono: true,
      rol: true,
      estado: true,
    },
  });

  return usuario;
}

export async function login(email: string, password: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    return { success: false, error: 'Credenciales inválidas' };
  }

  if (usuario.estado !== 'ACTIVO') {
    return { success: false, error: 'Usuario inactivo' };
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);

  if (!passwordValida) {
    return { success: false, error: 'Credenciales inválidas' };
  }

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set('usuario_id', usuario.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return {
    success: true,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
    },
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('usuario_id');
}

export async function registrar(datos: {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
}) {
  // Verificar si el email ya existe
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: datos.email },
  });

  if (usuarioExistente) {
    return { success: false, error: 'El email ya está registrado' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(datos.password, 10);

  // Crear usuario
  const usuario = await prisma.usuario.create({
    data: {
      id: crypto.randomUUID(),
      email: datos.email,
      password: hashedPassword,
      nombre: datos.nombre,
      apellido: datos.apellido || null,
      telefono: datos.telefono || null,
      rol: 'CLIENTE',
      estado: 'ACTIVO',
    },
  });

  // Auto login después del registro
  const cookieStore = await cookies();
  cookieStore.set('usuario_id', usuario.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return {
    success: true,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
    },
  };
}
