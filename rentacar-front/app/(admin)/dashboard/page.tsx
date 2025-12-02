'use client';

import { useState, useEffect } from 'react';
import { Car, Users, FileText, DollarSign, Clock, CheckCircle, Calendar, User, Phone, Mail } from 'lucide-react';

export default function DashboardPage() {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [actividad, setActividad] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setCargando(true);
    try {
      const response = await fetch('/api/dashboard/estadisticas', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Datos recibidos:', data);
        console.log('Solicitudes:', data.solicitudes);
        setEstadisticas(data.estadisticas);
        setActividad(data.actividad || []);
        setSolicitudes(data.solicitudes || []);
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
    setCargando(false);
  };

  const getEstadoBadge = (estado: string) => {
    const configs: any = {
      PENDIENTE: { color: 'bg-yellow-100 text-yellow-700', label: 'Pendiente' },
      CONFIRMADA: { color: 'bg-green-100 text-green-700', label: 'Confirmada' },
      EN_CURSO: { color: 'bg-blue-100 text-blue-700', label: 'En Curso' },
      COMPLETADA: { color: 'bg-gray-100 text-gray-700', label: 'Completada' },
      CANCELADA: { color: 'bg-red-100 text-red-700', label: 'Cancelada' },
      RECHAZADA: { color: 'bg-red-100 text-red-700', label: 'Rechazada' },
    };
    return configs[estado] || configs.PENDIENTE;
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de administración de RentaCar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Vehículos */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehículos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {estadisticas?.vehiculos?.total || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estadisticas?.vehiculos?.disponibles || 0} disponibles
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Reservas Activas */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reservas Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {estadisticas?.rentas?.activas || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estadisticas?.rentas?.pendientes || 0} pendientes
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Usuarios Registrados */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {estadisticas?.usuarios?.total || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estadisticas?.usuarios?.activos || 0} activos
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Ingresos del Mes */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos (Mes)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${estadisticas?.ingresos?.mes?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estadisticas?.rentas?.completadasMes || 0} rentas completadas
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {actividad && actividad.length > 0 ? (
              actividad.map((item) => {
                const badge = getEstadoBadge(item.estado);
                return (
                  <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.usuario}</p>
                        <p className="text-sm text-gray-600">{item.vehiculo}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          ${item.monto.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
            )}
          </div>
        </div>

        {/* Solicitudes Pendientes */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Solicitudes Pendientes</h2>
            {estadisticas?.rentas?.pendientes > 0 && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                {estadisticas.rentas.pendientes}
              </span>
            )}
          </div>
          <div className="space-y-4">
            {solicitudes && solicitudes.length > 0 ? (
              <>
                {solicitudes.map((solicitud) => (
                  <div key={solicitud.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {/* Imagen del vehículo */}
                      <div className="flex-shrink-0">
                        {solicitud.vehiculo.imagen ? (
                          <img
                            src={solicitud.vehiculo.imagen}
                            alt={solicitud.vehiculo.nombre}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Car className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Información */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {solicitud.vehiculo.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Placa: {solicitud.vehiculo.placa}
                        </p>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{solicitud.usuario.nombre}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-xs">{solicitud.usuario.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-xs">{solicitud.usuario.telefono}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">
                              {new Date(solicitud.fechaInicio).toLocaleDateString('es-ES')} - {new Date(solicitud.fechaFin).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-lg font-bold text-gray-900">
                              ${solicitud.precioTotal.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {solicitud.diasRenta} día(s)
                            </p>
                          </div>
                          <button
                            onClick={() => window.location.href = `/solicitudes?id=${solicitud.id}`}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Ver Solicitud
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {estadisticas?.rentas?.pendientes > 3 && (
                  <button
                    onClick={() => window.location.href = '/solicitudes'}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Ver todas las solicitudes ({estadisticas.rentas.pendientes})
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No hay solicitudes pendientes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
