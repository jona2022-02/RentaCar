'use client';

import { useState, useEffect } from 'react';
import { obtenerRentas } from '@/app/actions/admin-rentas';
import { Car, Calendar, User, Eye, CheckCircle, XCircle, Clock, Package, Download } from 'lucide-react';
import { generarContratoPDF } from '@/lib/generar-contrato-pdf';

export default function RentasAdminPage() {
  const [rentas, setRentas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<string>('TODAS');
  const [rentaSeleccionada, setRentaSeleccionada] = useState<any>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    cargarRentas();
  }, [filtro]);

  const cargarRentas = async () => {
    setCargando(true);
    const filtroEstado = filtro === 'TODAS' ? undefined : filtro;
    const { rentas: rentasData } = await obtenerRentas({ estado: filtroEstado });
    setRentas(rentasData);
    setCargando(false);
  };

  const abrirDetalle = (renta: any) => {
    setRentaSeleccionada(renta);
    setModalAbierto(true);
  };

  const cerrarDetalle = () => {
    setModalAbierto(false);
    setRentaSeleccionada(null);
  };

  const descargarContrato = () => {
    if (!rentaSeleccionada) return;

    generarContratoPDF({
      solicitud: rentaSeleccionada,
      usuario: rentaSeleccionada.usuario,
      vehiculo: rentaSeleccionada.vehiculo
    });
  };

  const getEstadoBadge = (estado: string) => {
    const configs: any = {
      PENDIENTE: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente', icon: Clock },
      CONFIRMADA: { color: 'bg-green-100 text-green-800', label: 'Confirmada', icon: CheckCircle },
      EN_CURSO: { color: 'bg-blue-100 text-blue-800', label: 'En Curso', icon: Package },
      COMPLETADA: { color: 'bg-gray-100 text-gray-800', label: 'Completada', icon: CheckCircle },
      CANCELADA: { color: 'bg-red-100 text-red-800', label: 'Cancelada', icon: XCircle },
      RECHAZADA: { color: 'bg-red-100 text-red-800', label: 'Rechazada', icon: XCircle },
    };
    return configs[estado] || configs.PENDIENTE;
  };

  const filtrarPorEstado = (estado: string) => {
    setFiltro(estado);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando rentas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Rentas</h1>
        <p className="text-gray-600 mt-2">Administra todas las rentas activas e historial ({rentas.length})</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => filtrarPorEstado('TODAS')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'TODAS'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => filtrarPorEstado('PENDIENTE')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'PENDIENTE'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => filtrarPorEstado('CONFIRMADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'CONFIRMADA'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Confirmadas
        </button>
        <button
          onClick={() => filtrarPorEstado('EN_CURSO')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'EN_CURSO'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          En Curso
        </button>
        <button
          onClick={() => filtrarPorEstado('COMPLETADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'COMPLETADA'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completadas
        </button>
        <button
          onClick={() => filtrarPorEstado('CANCELADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'CANCELADA'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Canceladas
        </button>
      </div>

      {/* Tabla de Rentas */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rentas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay rentas {filtro !== 'TODAS' ? `en estado ${filtro.toLowerCase()}` : 'registradas'}
                  </td>
                </tr>
              ) : (
                rentas.map((renta) => {
                  const badge = getEstadoBadge(renta.estado);
                  const IconoEstado = badge.icon;
                  
                  return (
                    <tr key={renta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {renta.usuario.nombre} {renta.usuario.apellido}
                            </div>
                            <div className="text-sm text-gray-500">{renta.usuario.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Car className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {renta.vehiculo.marca} {renta.vehiculo.modelo}
                            </div>
                            <div className="text-sm text-gray-500">{renta.vehiculo.anio} • {renta.vehiculo.placa}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Date(renta.fechaInicio).toLocaleDateString('es-ES')}
                            </div>
                            <div className="text-sm text-gray-500">
                              hasta {new Date(renta.fechaFin).toLocaleDateString('es-ES')}
                            </div>
                            <div className="text-xs text-gray-500">{renta.diasRenta} día(s)</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          ${renta.precioTotal.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Depósito: ${renta.deposito.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                          <IconoEstado className="w-3 h-3 mr-1" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => abrirDetalle(renta)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {modalAbierto && rentaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Detalles de la Renta</h2>
              <button
                onClick={cerrarDetalle}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Estado */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Estado de la Renta</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEstadoBadge(rentaSeleccionada.estado).color}`}>
                  {getEstadoBadge(rentaSeleccionada.estado).label}
                </span>
              </div>

              {/* Cliente */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Nombre</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {rentaSeleccionada.usuario.nombre} {rentaSeleccionada.usuario.apellido}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                    <p className="text-sm text-gray-900">{rentaSeleccionada.usuario.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Teléfono</label>
                    <p className="text-sm text-gray-900">{rentaSeleccionada.usuario.telefono || 'No especificado'}</p>
                  </div>
                </div>
              </div>

              {/* Vehículo */}
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Car className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Información del Vehículo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Vehículo</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {rentaSeleccionada.vehiculo.marca} {rentaSeleccionada.vehiculo.modelo} {rentaSeleccionada.vehiculo.anio}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Placa</label>
                    <p className="text-sm text-gray-900">{rentaSeleccionada.vehiculo.placa}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Color</label>
                    <p className="text-sm text-gray-900">{rentaSeleccionada.vehiculo.color || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Transmisión</label>
                    <p className="text-sm text-gray-900">{rentaSeleccionada.vehiculo.transmision}</p>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Periodo de Renta</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Inicio</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {new Date(rentaSeleccionada.fechaInicio).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Fin</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {new Date(rentaSeleccionada.fechaFin).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Duración</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {rentaSeleccionada.diasRenta} {rentaSeleccionada.diasRenta === 1 ? 'día' : 'días'}
                    </p>
                  </div>
                </div>

                {(rentaSeleccionada.lugarRecogida || rentaSeleccionada.lugarEntrega) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {rentaSeleccionada.lugarRecogida && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Lugar de Recogida</label>
                        <p className="text-sm text-gray-900">{rentaSeleccionada.lugarRecogida}</p>
                      </div>
                    )}
                    {rentaSeleccionada.lugarEntrega && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Lugar de Entrega</label>
                        <p className="text-sm text-gray-900">{rentaSeleccionada.lugarEntrega}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Costos */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles Financieros</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Precio Total</span>
                    <span className="text-lg font-bold text-gray-900">${rentaSeleccionada.precioTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Depósito</span>
                    <span className="text-sm font-medium text-gray-900">${rentaSeleccionada.deposito.toFixed(2)}</span>
                  </div>
                  {rentaSeleccionada.costoAdicional > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Costo Adicional</span>
                      <span className="text-sm font-medium text-red-600">${rentaSeleccionada.costoAdicional.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notas */}
              {rentaSeleccionada.notas && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Notas / Observaciones</label>
                  <p className="text-sm text-gray-900">{rentaSeleccionada.notas}</p>
                </div>
              )}

              {/* Botón de Descargar Contrato */}
              <div className="flex justify-center pt-4 border-t border-gray-200">
                <button
                  onClick={descargarContrato}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-md"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar Contrato de Arrendamiento (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
