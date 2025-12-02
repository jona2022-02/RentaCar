'use server';

import { prisma } from '@/lib/prisma';

export async function obtenerCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { vehiculos: true }
        }
      }
    });

    return {
      success: true,
      categorias: categorias.map((cat: any) => ({
        ...cat,
        creadoEn: cat.creadoEn.toISOString(),
        actualizadoEn: cat.actualizadoEn.toISOString(),
        vehiculosCount: cat._count.vehiculos
      })),
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      success: false,
      error: 'Error al cargar categorías',
      categorias: [],
    };
  }
}

export async function crearCategoria(datos: {
  nombre: string;
  descripcion?: string;
}) {
  try {
    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await prisma.categoria.findFirst({
      where: { 
        nombre: datos.nombre
      }
    });

    if (categoriaExistente) {
      return {
        success: false,
        error: 'Ya existe una categoría con ese nombre'
      };
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      }
    });

    return {
      success: true,
      categoria: {
        ...nuevaCategoria,
        creadoEn: nuevaCategoria.creadoEn.toISOString(),
        actualizadoEn: nuevaCategoria.actualizadoEn.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return {
      success: false,
      error: 'Error al crear la categoría'
    };
  }
}

export async function actualizarCategoria(id: string, datos: {
  nombre: string;
  descripcion?: string;
}) {
  try {
    // Verificar si ya existe otra categoría con el mismo nombre
    const categoriaExistente = await prisma.categoria.findFirst({
      where: { 
        nombre: datos.nombre,
        NOT: { id }
      }
    });

    if (categoriaExistente) {
      return {
        success: false,
        error: 'Ya existe otra categoría con ese nombre'
      };
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      }
    });

    return {
      success: true,
      categoria: {
        ...categoriaActualizada,
        creadoEn: categoriaActualizada.creadoEn.toISOString(),
        actualizadoEn: categoriaActualizada.actualizadoEn.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return {
      success: false,
      error: 'Error al actualizar la categoría'
    };
  }
}

export async function eliminarCategoria(id: string) {
  try {
    // Verificar si tiene vehículos asociados
    const vehiculosCount = await prisma.vehiculo.count({
      where: { categoriaId: id }
    });

    if (vehiculosCount > 0) {
      return {
        success: false,
        error: `No se puede eliminar una categoría con ${vehiculosCount} vehículo(s) asociado(s)`
      };
    }

    await prisma.categoria.delete({
      where: { id }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return {
      success: false,
      error: 'Error al eliminar la categoría'
    };
  }
}
