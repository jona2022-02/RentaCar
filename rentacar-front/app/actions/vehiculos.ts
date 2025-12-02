'use server';

import { prisma } from '@/lib/prisma';

export async function obtenerVehiculos(soloDisponibles = false) {
  try {
    // Si se solicitan solo disponibles, excluir vehículos que están EN_CURSO
    let whereClause: any = soloDisponibles ? { disponible: true } : undefined;

    if (soloDisponibles) {
      // Obtener IDs de vehículos que están actualmente en uso (EN_CURSO)
      const rentasEnCurso = await prisma.renta.findMany({
        where: {
          estado: 'EN_CURSO',
        },
        select: {
          vehiculoId: true,
        },
      });

      const vehiculosEnUso = rentasEnCurso.map(r => r.vehiculoId);

      // Excluir solo vehículos que están actualmente en uso
      if (vehiculosEnUso.length > 0) {
        whereClause = {
          disponible: true,
          id: {
            notIn: vehiculosEnUso,
          },
        };
      }
    }

    const vehiculos = await prisma.vehiculo.findMany({
      where: whereClause,
      include: {
        categoria: true,
      },
      orderBy: {
        marca: 'asc',
      },
    });

    return {
      success: true,
      vehiculos: vehiculos.map((v: any) => ({
        ...v,
        precioDia: Number(v.precioDia),
        precioSemana: v.precioSemana ? Number(v.precioSemana) : null,
        precioMes: v.precioMes ? Number(v.precioMes) : null,
        depositoRequerido: Number(v.depositoRequerido),
        creadoEn: v.creadoEn.toISOString(),
        actualizadoEn: v.actualizadoEn.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return {
      success: false,
      error: 'Error al cargar los vehículos',
      vehiculos: [],
    };
  }
}

export async function obtenerVehiculoPorId(id: string) {
  try {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });

    if (!vehiculo) {
      return {
        success: false,
        error: 'Vehículo no encontrado',
      };
    }

    return {
      success: true,
      vehiculo: {
        ...vehiculo,
        precioDia: Number(vehiculo.precioDia),
        precioSemana: vehiculo.precioSemana ? Number(vehiculo.precioSemana) : null,
        precioMes: vehiculo.precioMes ? Number(vehiculo.precioMes) : null,
        depositoRequerido: Number(vehiculo.depositoRequerido),
        creadoEn: vehiculo.creadoEn.toISOString(),
        actualizadoEn: vehiculo.actualizadoEn.toISOString(),
      },
    };
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    return {
      success: false,
      error: 'Error al cargar el vehículo',
    };
  }
}
