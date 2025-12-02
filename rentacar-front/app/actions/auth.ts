'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Usuario } from '@/types';
import { login as loginAuth, registrar as registrarAuth, logout as logoutAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  fechaNacimiento?: string;
}

export async function registrarUsuario(datos: DatosRegistro) {
  try {
    // Validar que el email no exista
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: datos.email },
    });

    if (usuarioExistente) {
      return {
        success: false,
        error: 'El email ya está registrado',
      };
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(datos.password, 10);

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        email: datos.email,
        password: passwordHash,
        telefono: datos.telefono || null,
        direccion: datos.direccion || null,
        ciudad: datos.ciudad || null,
        fechaNacimiento: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : null,
        rol: 'CLIENTE',
        estado: 'ACTIVO',
      },
    });

    // No enviar la contraseña al cliente
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    return {
      success: true,
      usuario: {
        ...usuarioSinPassword,
        creadoEn: usuarioSinPassword.creadoEn.toISOString(),
        actualizadoEn: usuarioSinPassword.actualizadoEn.toISOString(),
        fechaNacimiento: usuarioSinPassword.fechaNacimiento?.toISOString() || null,
      },
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return {
      success: false,
      error: 'Error al crear la cuenta. Intenta de nuevo.',
    };
  }
}

export async function iniciarSesion(email: string, password: string) {
  try {
    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    // Si no existe el usuario
    if (!usuario) {
      return {
        success: false,
        error: 'Credenciales inválidas',
      };
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return {
        success: false,
        error: 'Credenciales inválidas',
      };
    }

    // Verificar que el usuario esté activo
    if (usuario.estado !== 'ACTIVO') {
      return {
        success: false,
        error: 'Usuario inactivo o suspendido',
      };
    }

    // No enviar la contraseña al cliente
    const { password: _, ...usuarioSinPassword } = usuario;

    return {
      success: true,
      usuario: {
        ...usuarioSinPassword,
        creadoEn: usuarioSinPassword.creadoEn.toISOString(),
        actualizadoEn: usuarioSinPassword.actualizadoEn.toISOString(),
        fechaNacimiento: usuarioSinPassword.fechaNacimiento?.toISOString() || null,
      },
    };
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      error: 'Error al iniciar sesión',
    };
  }
}

export async function loginAction(email: string, password: string) {
  const resultado = await loginAuth(email, password);
  
  if (resultado.success) {
    revalidatePath('/');
    redirect('/vehiculos');
  }
  
  return resultado;
}

export async function registrarAction(datos: {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
}) {
  const resultado = await registrarAuth(datos);
  
  if (resultado.success) {
    revalidatePath('/');
    redirect('/vehiculos');
  }
  
  return resultado;
}

export async function logoutAction() {
  await logoutAuth();
  revalidatePath('/');
  redirect('/');
}
