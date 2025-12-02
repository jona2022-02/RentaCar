'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function obtenerUsuarios(filtros?: {
  busqueda?: string;
  rol?: string;
  estado?: string;
}) {
  try {
    const where: any = {};

    if (filtros?.busqueda) {
      where.OR = [
        { nombre: { contains: filtros.busqueda } },
        { apellido: { contains: filtros.busqueda } },
        { email: { contains: filtros.busqueda } },
      ];
    }

    if (filtros?.rol) {
      where.rol = filtros.rol;
    }

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      orderBy: { creadoEn: 'desc' },
      include: {
        _count: {
          select: { rentas: true }
        }
      }
    });

    // Excluir password
    const usuariosSinPassword = usuarios.map(({ password, ...usuario }: any) => ({
      ...usuario,
      creadoEn: usuario.creadoEn.toISOString(),
      actualizadoEn: usuario.actualizadoEn.toISOString(),
      fechaNacimiento: usuario.fechaNacimiento?.toISOString() || null,
      rentasCount: usuario._count.rentas
    }));

    return {
      success: true,
      usuarios: usuariosSinPassword,
    };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return {
      success: false,
      error: 'Error al cargar usuarios',
      usuarios: [],
    };
  }
}

export async function crearUsuario(datos: {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  numeroLicencia?: string;
  rol: 'CLIENTE' | 'ADMIN';
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
}) {
  try {
    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: datos.email }
    });

    if (usuarioExistente) {
      return {
        success: false,
        error: 'El email ya está registrado'
      };
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(datos.password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email: datos.email,
        password: hashedPassword,
        nombre: datos.nombre,
        apellido: datos.apellido || null,
        telefono: datos.telefono || null,
        direccion: datos.direccion || null,
        ciudad: datos.ciudad || null,
        numeroLicencia: datos.numeroLicencia || null,
        rol: datos.rol,
        estado: datos.estado || 'ACTIVO',
      }
    });

    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    return {
      success: true,
      usuario: {
        ...usuarioSinPassword,
        creadoEn: usuarioSinPassword.creadoEn.toISOString(),
        actualizadoEn: usuarioSinPassword.actualizadoEn.toISOString(),
        fechaNacimiento: usuarioSinPassword.fechaNacimiento?.toISOString() || null,
      }
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      success: false,
      error: 'Error al crear el usuario'
    };
  }
}

export async function actualizarUsuario(id: string, datos: {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  numeroLicencia?: string;
  rol?: 'CLIENTE' | 'ADMIN';
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  password?: string;
}) {
  try {
    const dataActualizar: any = {
      nombre: datos.nombre,
      apellido: datos.apellido || null,
      telefono: datos.telefono || null,
      direccion: datos.direccion || null,
      ciudad: datos.ciudad || null,
      numeroLicencia: datos.numeroLicencia || null,
      rol: datos.rol,
      estado: datos.estado,
    };

    // Si se proporciona password, hashearlo
    if (datos.password && datos.password.trim() !== '') {
      dataActualizar.password = await bcrypt.hash(datos.password, 10);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: dataActualizar
    });

    const { password: _, ...usuarioSinPassword } = usuarioActualizado;

    return {
      success: true,
      usuario: {
        ...usuarioSinPassword,
        creadoEn: usuarioSinPassword.creadoEn.toISOString(),
        actualizadoEn: usuarioSinPassword.actualizadoEn.toISOString(),
        fechaNacimiento: usuarioSinPassword.fechaNacimiento?.toISOString() || null,
      }
    };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return {
      success: false,
      error: 'Error al actualizar el usuario'
    };
  }
}

export async function eliminarUsuario(id: string) {
  try {
    // Verificar si tiene rentas activas
    const rentasActivas = await prisma.renta.count({
      where: {
        usuarioId: id,
        estado: {
          in: ['PENDIENTE', 'EN_CURSO']
        }
      }
    });

    if (rentasActivas > 0) {
      return {
        success: false,
        error: 'No se puede eliminar un usuario con rentas activas'
      };
    }

    await prisma.usuario.delete({
      where: { id }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return {
      success: false,
      error: 'Error al eliminar el usuario'
    };
  }
}

export async function cambiarEstadoUsuario(id: string, estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO') {
  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { estado }
    });

    const { password: _, ...usuarioSinPassword } = usuarioActualizado;

    return {
      success: true,
      usuario: {
        ...usuarioSinPassword,
        creadoEn: usuarioSinPassword.creadoEn.toISOString(),
        actualizadoEn: usuarioSinPassword.actualizadoEn.toISOString(),
        fechaNacimiento: usuarioSinPassword.fechaNacimiento?.toISOString() || null,
      }
    };
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return {
      success: false,
      error: 'Error al cambiar el estado del usuario'
    };
  }
}

export async function obtenerEstadisticasUsuarios() {
  try {
    const [total, clientes, admins, activos, inactivos, suspendidos] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({ where: { rol: 'CLIENTE' } }),
      prisma.usuario.count({ where: { rol: 'ADMIN' } }),
      prisma.usuario.count({ where: { estado: 'ACTIVO' } }),
      prisma.usuario.count({ where: { estado: 'INACTIVO' } }),
      prisma.usuario.count({ where: { estado: 'SUSPENDIDO' } }),
    ]);

    return {
      success: true,
      estadisticas: {
        total,
        clientes,
        admins,
        activos,
        inactivos,
        suspendidos
      }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      error: 'Error al cargar estadísticas',
      estadisticas: {
        total: 0,
        clientes: 0,
        admins: 0,
        activos: 0,
        inactivos: 0,
        suspendidos: 0
      }
    };
  }
}
