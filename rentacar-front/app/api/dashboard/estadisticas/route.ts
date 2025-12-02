import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUsuarioActual } from '@/lib/auth';

// GET /api/dashboard/estadisticas - Obtener estadísticas del dashboard
export async function GET(request: NextRequest) {
  try {
    const usuarioActual = await getUsuarioActual();

    if (!usuarioActual) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Solo ADMIN puede ver el dashboard
    if (usuarioActual.rol !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder al dashboard' },
        { status: 403 }
      );
    }

    // Obtener fecha del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    // Ejecutar todas las consultas en paralelo
    const [
      totalVehiculos,
      vehiculosDisponibles,
      totalUsuarios,
      usuariosActivos,
      reservasActivas,
      solicitudesPendientes,
      ingresosMes,
      rentasCompletadas,
      actividadReciente,
      solicitudesRecientes,
    ] = await Promise.all([
      // Total de vehículos
      prisma.vehiculo.count(),
      
      // Vehículos disponibles
      prisma.vehiculo.count({
        where: { disponible: true }
      }),
      
      // Total de usuarios
      prisma.usuario.count(),
      
      // Usuarios activos
      prisma.usuario.count({
        where: { estado: 'ACTIVO' }
      }),
      
      // Reservas activas (EN_CURSO + CONFIRMADA)
      prisma.renta.count({
        where: {
          estado: {
            in: ['EN_CURSO', 'CONFIRMADA']
          }
        }
      }),
      
      // Solicitudes pendientes
      prisma.renta.count({
        where: { estado: 'PENDIENTE' }
      }),
      
      // Ingresos del mes (rentas completadas)
      prisma.renta.aggregate({
        where: {
          estado: 'COMPLETADA',
          actualizadoEn: {
            gte: inicioMes
          }
        },
        _sum: {
          precioTotal: true
        }
      }),
      
      // Rentas completadas este mes
      prisma.renta.count({
        where: {
          estado: 'COMPLETADA',
          actualizadoEn: {
            gte: inicioMes
          }
        }
      }),
      
      // Actividad reciente (últimas 3 rentas)
      prisma.renta.findMany({
        take: 3,
        orderBy: { creadoEn: 'desc' },
        include: {
          usuario: {
            select: {
              nombre: true,
              apellido: true,
              email: true
            }
          },
          vehiculo: {
            select: {
              marca: true,
              modelo: true,
              anio: true
            }
          }
        }
      }),

      // Últimas 3 solicitudes pendientes
      prisma.renta.findMany({
        take: 3,
        where: { estado: 'PENDIENTE' },
        orderBy: { creadoEn: 'desc' },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
              telefono: true,
              numeroLicencia: true
            }
          },
          vehiculo: {
            select: {
              marca: true,
              modelo: true,
              anio: true,
              placa: true,
              imagenes: true,
              color: true,
              transmision: true,
              tipoCombustible: true,
              numeroPasajeros: true,
              numeroPuertas: true,
              precioDia: true,
              categoria: true
            }
          },
          pagos: true
        }
      }),
    ]);

    // Formatear actividad reciente
    const actividad = actividadReciente.map((renta) => ({
      id: renta.id,
      tipo: 'renta',
      estado: renta.estado,
      fecha: renta.creadoEn.toISOString(),
      usuario: `${renta.usuario.nombre} ${renta.usuario.apellido || ''}`.trim(),
      vehiculo: `${renta.vehiculo.marca} ${renta.vehiculo.modelo} ${renta.vehiculo.anio}`,
      monto: parseFloat(renta.precioTotal.toString()),
    }));

    const ingresosMesTotal = ingresosMes._sum.precioTotal 
      ? parseFloat(ingresosMes._sum.precioTotal.toString()) 
      : 0;

    // Formatear solicitudes recientes
    const solicitudes = solicitudesRecientes.map((renta) => {
      const imagenes = renta.vehiculo.imagenes as string[] | null;
      return {
        id: renta.id,
        usuario: {
          id: renta.usuario.id,
          nombre: `${renta.usuario.nombre} ${renta.usuario.apellido || ''}`.trim(),
          email: renta.usuario.email,
          telefono: renta.usuario.telefono || 'No especificado',
          numeroLicencia: renta.usuario.numeroLicencia || 'No especificada'
        },
        vehiculo: {
          marca: renta.vehiculo.marca,
          modelo: renta.vehiculo.modelo,
          anio: renta.vehiculo.anio,
          nombre: `${renta.vehiculo.marca} ${renta.vehiculo.modelo} ${renta.vehiculo.anio}`,
          placa: renta.vehiculo.placa,
          color: renta.vehiculo.color,
          transmision: renta.vehiculo.transmision,
          tipoCombustible: renta.vehiculo.tipoCombustible,
          numeroPasajeros: renta.vehiculo.numeroPasajeros,
          numeroPuertas: renta.vehiculo.numeroPuertas,
          precioDia: parseFloat(renta.vehiculo.precioDia.toString()),
          categoria: renta.vehiculo.categoria,
          imagen: imagenes && imagenes.length > 0 ? imagenes[0] : null
        },
        fechaInicio: renta.fechaInicio.toISOString(),
        fechaFin: renta.fechaFin.toISOString(),
        diasRenta: renta.diasRenta,
        precioTotal: parseFloat(renta.precioTotal.toString()),
        deposito: parseFloat(renta.deposito.toString()),
        fechaSolicitud: renta.creadoEn.toISOString(),
        pagos: renta.pagos.map((p: any) => ({
          id: p.id,
          monto: parseFloat(p.monto.toString()),
          metodoPago: p.metodoPago,
          estado: p.estado,
          referencia: p.referencia
        }))
      };
    });

    console.log('Solicitudes encontradas:', solicitudesRecientes.length);
    console.log('Solicitudes formateadas:', solicitudes);

    return NextResponse.json(
      {
        estadisticas: {
          vehiculos: {
            total: totalVehiculos,
            disponibles: vehiculosDisponibles,
            enUso: totalVehiculos - vehiculosDisponibles
          },
          usuarios: {
            total: totalUsuarios,
            activos: usuariosActivos,
            inactivos: totalUsuarios - usuariosActivos
          },
          rentas: {
            activas: reservasActivas,
            pendientes: solicitudesPendientes,
            completadasMes: rentasCompletadas
          },
          ingresos: {
            mes: ingresosMesTotal,
            promedioPorRenta: rentasCompletadas > 0 
              ? ingresosMesTotal / rentasCompletadas
              : 0
          }
        },
        actividad,
        solicitudes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas del dashboard' },
      { status: 500 }
    );
  }
}
