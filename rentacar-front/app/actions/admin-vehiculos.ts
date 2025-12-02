'use server';

import { prisma } from '@/lib/prisma';

export async function crearVehiculo(datos: any) {
  try {
    const nuevoVehiculo = await prisma.vehiculo.create({
      data: datos,
    });

    return {
      success: true,
      vehiculo: {
        ...nuevoVehiculo,
        precioDia: Number(nuevoVehiculo.precioDia),
        precioSemana: nuevoVehiculo.precioSemana ? Number(nuevoVehiculo.precioSemana) : null,
        precioMes: nuevoVehiculo.precioMes ? Number(nuevoVehiculo.precioMes) : null,
        depositoRequerido: Number(nuevoVehiculo.depositoRequerido),
        creadoEn: nuevoVehiculo.creadoEn.toISOString(),
        actualizadoEn: nuevoVehiculo.actualizadoEn.toISOString(),
      },
    };
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    return {
      success: false,
      error: 'Error al crear el vehículo',
    };
  }
}

export async function actualizarVehiculo(id: string, datos: any) {
  try {
    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id },
      data: datos,
    });

    return {
      success: true,
      vehiculo: {
        ...vehiculoActualizado,
        precioDia: Number(vehiculoActualizado.precioDia),
        precioSemana: vehiculoActualizado.precioSemana ? Number(vehiculoActualizado.precioSemana) : null,
        precioMes: vehiculoActualizado.precioMes ? Number(vehiculoActualizado.precioMes) : null,
        depositoRequerido: Number(vehiculoActualizado.depositoRequerido),
        creadoEn: vehiculoActualizado.creadoEn.toISOString(),
        actualizadoEn: vehiculoActualizado.actualizadoEn.toISOString(),
      },
    };
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    return {
      success: false,
      error: 'Error al actualizar el vehículo',
    };
  }
}

export async function eliminarVehiculo(id: string) {
  try {
    await prisma.vehiculo.delete({
      where: { id },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    return {
      success: false,
      error: 'Error al eliminar el vehículo',
    };
  }
}

export async function cambiarDisponibilidadVehiculo(id: string, disponible: boolean) {
  try {
    const vehiculo = await prisma.vehiculo.update({
      where: { id },
      data: { disponible },
    });

    return {
      success: true,
      vehiculo: {
        ...vehiculo,
        precioDia: Number(vehiculo.precioDia),
        creadoEn: vehiculo.creadoEn.toISOString(),
        actualizadoEn: vehiculo.actualizadoEn.toISOString(),
      },
    };
  } catch (error) {
    console.error('Error al cambiar disponibilidad:', error);
    return {
      success: false,
      error: 'Error al cambiar la disponibilidad',
    };
  }
}

export async function obtenerCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });

    return {
      success: true,
      categorias: categorias.map((c: any) => ({
        ...c,
        creadoEn: c.creadoEn.toISOString(),
        actualizadoEn: c.actualizadoEn.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      success: false,
      error: 'Error al cargar las categorías',
      categorias: [],
    };
  }
}
