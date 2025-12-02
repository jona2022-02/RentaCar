'use server';

import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { getUsuarioActual } from '@/lib/auth';

interface DatosReserva {
  vehiculoId: string;
  fechaInicio: Date;
  fechaFin: Date;
  lugarRecogida?: string;
  lugarEntrega?: string;
  notas?: string;
  metodoPago: 'EFECTIVO' | 'TARJETA';
}

export async function crearReserva(datos: DatosReserva) {
  try {
    // Obtener usuario autenticado
    const usuario = await getUsuarioActual();

    if (!usuario) {
      return {
        success: false,
        error: 'Debes iniciar sesión para hacer una reserva',
        requiresLogin: true,
      };
    }

    // Validar que sea un cliente
    if (usuario.rol !== 'CLIENTE') {
      return {
        success: false,
        error: 'Solo los clientes pueden hacer reservas',
      };
    }

    // Validar que las fechas no sean pasadas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaInicio = new Date(datos.fechaInicio);
    fechaInicio.setHours(0, 0, 0, 0);
    
    if (fechaInicio < hoy) {
      return {
        success: false,
        error: 'La fecha de inicio no puede ser anterior a hoy',
      };
    }

    const fechaFin = new Date(datos.fechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    if (fechaFin < fechaInicio) {
      return {
        success: false,
        error: 'La fecha de fin debe ser posterior a la fecha de inicio',
      };
    }

    // Calcular días de renta
    const diasRenta = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (diasRenta < 1) {
      return {
        success: false,
        error: 'La reserva debe ser de al menos 1 día',
      };
    }

    // Obtener vehículo y verificar disponibilidad
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: datos.vehiculoId },
    });

    if (!vehiculo) {
      return {
        success: false,
        error: 'Vehículo no encontrado',
      };
    }

    if (!vehiculo.disponible) {
      return {
        success: false,
        error: 'El vehículo no está disponible',
      };
    }

    // Verificar que no haya conflicto solo con rentas EN_CURSO (vehículo ya entregado)
    const reservasConflicto = await prisma.renta.findMany({
      where: {
        vehiculoId: datos.vehiculoId,
        estado: 'EN_CURSO',
        OR: [
          {
            AND: [
              { fechaInicio: { lte: fechaFin } },
              { fechaFin: { gte: fechaInicio } },
            ],
          },
        ],
      },
    });

    if (reservasConflicto.length > 0) {
      return {
        success: false,
        error: 'El vehículo ya está en uso durante esas fechas',
      };
    }

    // Calcular precio total
    const precioTotal = Number(vehiculo.precioDia) * diasRenta;
    const deposito = Number(vehiculo.depositoRequerido);

    // Crear la reserva
    const renta = await prisma.renta.create({
      data: {
        id: randomUUID(),
        vehiculoId: datos.vehiculoId,
        usuarioId: usuario.id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        diasRenta: diasRenta,
        precioTotal: precioTotal,
        deposito: deposito,
        lugarRecogida: datos.lugarRecogida || null,
        lugarEntrega: datos.lugarEntrega || null,
        notas: datos.notas || null,
        estado: 'PENDIENTE',
      },
    });

    // Crear el registro de pago
    const estadoPago = datos.metodoPago === 'EFECTIVO' ? 'PENDIENTE' : 'COMPLETADO';
    const montoPago = precioTotal + deposito;

    await prisma.pago.create({
      data: {
        id: randomUUID(),
        rentaId: renta.id,
        usuarioId: usuario.id,
        monto: montoPago,
        metodoPago: datos.metodoPago,
        estado: estadoPago,
        notas: datos.metodoPago === 'EFECTIVO' 
          ? 'Pago en efectivo a realizar de forma presencial al recoger el vehículo'
          : 'Pago procesado con tarjeta (simulado)',
        referencia: datos.metodoPago === 'TARJETA' 
          ? `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          : null,
      },
    });

    console.log('Reserva creada exitosamente:', renta.id);

    revalidatePath('/vehiculos');
    revalidatePath('/admin/solicitudes');

    return {
      success: true,
      rentaId: renta.id,
      message: 'Reserva creada exitosamente. Pendiente de aprobación.',
    };
  } catch (error) {
    console.error('Error al crear reserva:', error);
    return {
      success: false,
      error: 'Error al crear la reserva',
    };
  }
}

export async function obtenerSolicitudesPendientes() {
  try {
    const count = await prisma.renta.count({
      where: {
        estado: 'PENDIENTE',
      },
    });

    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return {
      success: false,
      error: 'Error al obtener solicitudes',
      solicitudes: [],
    };
  }
}

export async function aprobarSolicitud(rentaId: string) {
  try {
    await prisma.renta.update({
      where: { id: rentaId },
      data: {
        estado: 'CONFIRMADA',
      },
    });

    revalidatePath('/admin/solicitudes');

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

export async function rechazarSolicitud(rentaId: string) {
  try {
    await prisma.renta.update({
      where: { id: rentaId },
      data: {
        estado: 'RECHAZADA',
      },
    });

    revalidatePath('/admin/solicitudes');

    return {
      success: true,
      message: 'Solicitud rechazada',
    };
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    return {
      success: false,
      error: 'Error al rechazar la solicitud',
    };
  }
}

export async function obtenerEstadisticasSolicitudes() {
  try {
    const total = await prisma.renta.count({
      where: { estado: 'PENDIENTE' },
    });

    const confirmadas = await prisma.renta.count({
      where: { estado: 'CONFIRMADA' },
    });

    const rechazadas = await prisma.renta.count({
      where: { estado: 'RECHAZADA' },
    });

    const enCurso = await prisma.renta.count({
      where: { estado: 'EN_CURSO' },
    });

    return {
      success: true,
      estadisticas: {
        pendientes: total,
        confirmadas,
        rechazadas,
        enCurso,
      },
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      estadisticas: {
        pendientes: 0,
        confirmadas: 0,
        rechazadas: 0,
        enCurso: 0,
      },
    };
  }
}

export async function cancelarSolicitud(rentaId: string) {
  try {
    // Obtener usuario actual
    const usuario = await getUsuarioActual();

    if (!usuario) {
      return {
        success: false,
        error: 'Debes iniciar sesión',
      };
    }

    // Verificar que la renta existe y pertenece al usuario
    const renta = await prisma.renta.findUnique({
      where: { id: rentaId },
    });

    if (!renta) {
      return {
        success: false,
        error: 'Solicitud no encontrada',
      };
    }

    if (renta.usuarioId !== usuario.id) {
      return {
        success: false,
        error: 'No tienes permiso para cancelar esta solicitud',
      };
    }

    // Solo se puede cancelar si está en estado PENDIENTE
    if (renta.estado !== 'PENDIENTE') {
      return {
        success: false,
        error: 'Solo puedes cancelar solicitudes pendientes',
      };
    }

    // Actualizar estado a CANCELADA
    await prisma.renta.update({
      where: { id: rentaId },
      data: {
        estado: 'CANCELADA',
        notas: renta.notas 
          ? `${renta.notas}\n\nCancelada por el usuario el ${new Date().toLocaleString('es-ES')}`
          : `Cancelada por el usuario el ${new Date().toLocaleString('es-ES')}`,
      },
    });

    revalidatePath('/mis-rentas');

    return {
      success: true,
      message: 'Solicitud cancelada exitosamente',
    };
  } catch (error) {
    console.error('Error al cancelar solicitud:', error);
    return {
      success: false,
      error: 'Error al cancelar la solicitud',
    };
  }
}
