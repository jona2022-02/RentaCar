'use server';

import { prisma } from '@/lib/prisma';

export async function obtenerRentas(filtros?: {
  estado?: string;
  usuarioId?: string;
}) {
  try {
    const where: any = {};

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    if (filtros?.usuarioId) {
      where.usuarioId = filtros.usuarioId;
    }

    const rentas = await prisma.renta.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        },
        vehiculo: {
          include: {
            categoria: true,
          }
        },
        pagos: true,
      },
      orderBy: {
        creadoEn: 'desc',
      },
    });

    return {
      success: true,
      rentas: rentas.map((r: any) => ({
        id: r.id,
        vehiculoId: r.vehiculoId,
        usuarioId: r.usuarioId,
        fechaInicio: r.fechaInicio.toISOString().split('T')[0],
        fechaFin: r.fechaFin.toISOString().split('T')[0],
        fechaEntregaReal: r.fechaEntregaReal?.toISOString() || null,
        fechaDevolucionReal: r.fechaDevolucionReal?.toISOString() || null,
        diasRenta: r.diasRenta,
        precioTotal: parseFloat(r.precioTotal.toString()),
        deposito: parseFloat(r.deposito.toString()),
        costoAdicional: parseFloat(r.costoAdicional.toString()),
        razonAdicional: r.razonAdicional,
        lugarRecogida: r.lugarRecogida,
        lugarEntrega: r.lugarEntrega,
        kilometrajeInicio: r.kilometrajeInicio,
        kilometrajeFin: r.kilometrajeFin,
        nivelCombustibleInicio: r.nivelCombustibleInicio,
        nivelCombustibleFin: r.nivelCombustibleFin,
        estado: r.estado,
        notas: r.notas,
        fotoAntes: r.fotoAntes,
        fotoDespues: r.fotoDespues,
        creadoEn: r.creadoEn.toISOString(),
        actualizadoEn: r.actualizadoEn.toISOString(),
        usuario: {
          id: r.usuario.id,
          nombre: r.usuario.nombre,
          apellido: r.usuario.apellido,
          email: r.usuario.email,
          telefono: r.usuario.telefono,
        },
        vehiculo: {
          id: r.vehiculo.id,
          categoriaId: r.vehiculo.categoriaId,
          marca: r.vehiculo.marca,
          modelo: r.vehiculo.modelo,
          anio: r.vehiculo.anio,
          color: r.vehiculo.color,
          placa: r.vehiculo.placa,
          numeroMotor: r.vehiculo.numeroMotor,
          numeroChasis: r.vehiculo.numeroChasis,
          kilometraje: r.vehiculo.kilometraje,
          tipoCombustible: r.vehiculo.tipoCombustible,
          transmision: r.vehiculo.transmision,
          numeroPasajeros: r.vehiculo.numeroPasajeros,
          numeroPuertas: r.vehiculo.numeroPuertas,
          tieneAireAcondicionado: r.vehiculo.tieneAireAcondicionado,
          descripcion: r.vehiculo.descripcion,
          precioDia: parseFloat(r.vehiculo.precioDia.toString()),
          precioSemana: r.vehiculo.precioSemana ? parseFloat(r.vehiculo.precioSemana.toString()) : null,
          precioMes: r.vehiculo.precioMes ? parseFloat(r.vehiculo.precioMes.toString()) : null,
          depositoRequerido: parseFloat(r.vehiculo.depositoRequerido.toString()),
          imagenes: r.vehiculo.imagenes,
          disponible: r.vehiculo.disponible,
          creadoEn: r.vehiculo.creadoEn.toISOString(),
          actualizadoEn: r.vehiculo.actualizadoEn.toISOString(),
          categoria: r.vehiculo.categoria ? {
            id: r.vehiculo.categoria.id,
            nombre: r.vehiculo.categoria.nombre,
            descripcion: r.vehiculo.categoria.descripcion,
            creadoEn: r.vehiculo.categoria.creadoEn.toISOString(),
            actualizadoEn: r.vehiculo.categoria.actualizadoEn.toISOString(),
          } : null,
        },
        pagos: r.pagos.map((p: any) => ({
          id: p.id,
          rentaId: p.rentaId,
          usuarioId: p.usuarioId,
          monto: parseFloat(p.monto.toString()),
          metodoPago: p.metodoPago,
          estado: p.estado,
          referencia: p.referencia,
          descripcion: p.descripcion,
          fechaPago: p.fechaPago.toISOString(),
          creadoEn: p.creadoEn.toISOString(),
          actualizadoEn: p.actualizadoEn.toISOString(),
        })),
      })),
    };
  } catch (error) {
    console.error('Error al obtener rentas:', error);
    return {
      success: false,
      error: 'Error al cargar las rentas',
      rentas: [],
    };
  }
}

export async function aprobarSolicitud(rentaId: string) {
  try {
    await prisma.renta.update({
      where: { id: rentaId },
      data: { estado: 'CONFIRMADA' },
    });

    return {
      success: true,
      message: 'Solicitud aprobada exitosamente',
    };
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    return {
      success: false,
      error: 'Error al aprobar la solicitud',
    };
  }
}

export async function rechazarSolicitud(rentaId: string, motivo?: string) {
  try {
    await prisma.renta.update({
      where: { id: rentaId },
      data: { 
        estado: 'RECHAZADA',
        notas: motivo || 'Solicitud rechazada por el administrador',
      },
    });

    return {
      success: true,
      message: 'Solicitud rechazada exitosamente',
    };
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    return {
      success: false,
      error: 'Error al rechazar la solicitud',
    };
  }
}

export async function cambiarEstadoRenta(rentaId: string, nuevoEstado: string) {
  try {
    await prisma.renta.update({
      where: { id: rentaId },
      data: { estado: nuevoEstado as any },
    });

    return {
      success: true,
      message: 'Estado actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return {
      success: false,
      error: 'Error al cambiar el estado',
    };
  }
}

export async function obtenerEstadisticasRentas() {
  try {
    const [total, pendientes, confirmadas, enCurso, completadas, canceladas] = await Promise.all([
      prisma.renta.count(),
      prisma.renta.count({ where: { estado: 'PENDIENTE' } }),
      prisma.renta.count({ where: { estado: 'CONFIRMADA' } }),
      prisma.renta.count({ where: { estado: 'EN_CURSO' } }),
      prisma.renta.count({ where: { estado: 'COMPLETADA' } }),
      prisma.renta.count({ where: { estado: 'CANCELADA' } }),
    ]);

    return {
      success: true,
      estadisticas: {
        total,
        pendientes,
        confirmadas,
        enCurso,
        completadas,
        canceladas,
      }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      error: 'Error al cargar estadísticas',
      estadisticas: {
        total: 0,
        pendientes: 0,
        confirmadas: 0,
        enCurso: 0,
        completadas: 0,
        canceladas: 0,
      }
    };
  }
}
