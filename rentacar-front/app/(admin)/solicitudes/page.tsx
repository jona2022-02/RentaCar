'use client';

import { useState, useEffect } from 'react';
import { obtenerRentas, aprobarSolicitud, rechazarSolicitud } from '@/app/actions/admin-rentas';
import { CheckCircle, XCircle, Eye, Calendar, DollarSign, User, Car, X, FileText, Download } from 'lucide-react';
import { generarContratoPDF } from '@/lib/generar-contrato-pdf';

export default function SolicitudesAdminPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<string>('PENDIENTE');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<any>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    cargarSolicitudes();
  }, [filtro]);

  const cargarSolicitudes = async () => {
    setCargando(true);
    const { rentas } = await obtenerRentas({ estado: filtro });
    setSolicitudes(rentas);
    setCargando(false);
  };

  const handleAprobar = async (rentaId: string, clienteNombre: string) => {
    if (confirm(`¿Aprobar solicitud de ${clienteNombre}?`)) {
      const resultado = await aprobarSolicitud(rentaId);
      if (resultado.success) {
        cargarSolicitudes();
      } else {
        alert(resultado.error);
      }
    }
  };

  const handleRechazar = async (rentaId: string, clienteNombre: string) => {
    const motivo = prompt(`¿Por qué rechazar la solicitud de ${clienteNombre}?`);
    if (motivo !== null) {
      const resultado = await rechazarSolicitud(rentaId, motivo);
      if (resultado.success) {
        cargarSolicitudes();
      } else {
        alert(resultado.error);
      }
    }
  };

  const abrirDetalle = (solicitud: any) => {
    setSolicitudSeleccionada(solicitud);
    setModalAbierto(true);
  };

  const cerrarDetalle = () => {
    setModalAbierto(false);
    setSolicitudSeleccionada(null);
  };

  const descargarContrato = () => {
    if (!solicitudSeleccionada) return;

    generarContratoPDF({
      solicitud: solicitudSeleccionada,
      usuario: solicitudSeleccionada.usuario,
      vehiculo: solicitudSeleccionada.vehiculo
    });
  };

  const getEstadoBadge = (estado: string) => {
    const estilos: any = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      CONFIRMADA: 'bg-green-100 text-green-800',
      EN_CURSO: 'bg-blue-100 text-blue-800',
      COMPLETADA: 'bg-gray-100 text-gray-800',
      CANCELADA: 'bg-red-100 text-red-800',
      RECHAZADA: 'bg-red-100 text-red-800',
    };
    return estilos[estado] || 'bg-gray-100 text-gray-800';
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Cargando solicitudes...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Reserva</h1>
          <p className="text-gray-600 mt-2">Revisa y aprueba las solicitudes de reserva de clientes ({solicitudes.length})</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFiltro('PENDIENTE')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'PENDIENTE'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFiltro('CONFIRMADA')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'CONFIRMADA'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aprobadas
          </button>
          <button
            onClick={() => setFiltro('RECHAZADA')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'RECHAZADA'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rechazadas
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
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
              {solicitudes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay solicitudes {filtro === 'PENDIENTE' ? 'pendientes' : filtro === 'CONFIRMADA' ? 'aprobadas' : 'rechazadas'}
                  </td>
                </tr>
              ) : (
                solicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {solicitud.usuario.nombre} {solicitud.usuario.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          {solicitud.usuario.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {solicitud.usuario.telefono || 'Sin teléfono'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {solicitud.vehiculo.marca} {solicitud.vehiculo.modelo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {solicitud.vehiculo.anio} • {solicitud.vehiculo.placa}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{new Date(solicitud.fechaInicio).toLocaleDateString('es-ES')}</div>
                          <div className="text-xs text-gray-500">
                            hasta {new Date(solicitud.fechaFin).toLocaleDateString('es-ES')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {solicitud.diasRenta} {solicitud.diasRenta === 1 ? 'día' : 'días'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        ${solicitud.precioTotal.toFixed(2)}
                      </div>
                      {solicitud.deposito > 0 && (
                        <div className="text-xs text-gray-500">
                          Depósito: ${solicitud.deposito.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(solicitud.estado)}`}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => abrirDetalle(solicitud)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {solicitud.estado === 'PENDIENTE' && (
                          <>
                            <button
                              onClick={() => handleAprobar(solicitud.id, `${solicitud.usuario.nombre} ${solicitud.usuario.apellido}`)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRechazar(solicitud.id, `${solicitud.usuario.nombre} ${solicitud.usuario.apellido}`)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Rechazar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {modalAbierto && solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Detalles de la Solicitud</h2>
              <button
                onClick={cerrarDetalle}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Estado */}
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 text-sm font-medium rounded-full ${getEstadoBadge(solicitudSeleccionada.estado)}`}>
                  {solicitudSeleccionada.estado}
                </span>
                <div className="text-sm text-gray-500">
                  Solicitud creada: {new Date(solicitudSeleccionada.creadoEn).toLocaleString('es-ES')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Cliente */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <User className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Nombre Completo</label>
                      <p className="text-sm text-gray-900 font-medium">
                        {solicitudSeleccionada.usuario.nombre} {solicitudSeleccionada.usuario.apellido}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                      <p className="text-sm text-gray-900">{solicitudSeleccionada.usuario.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Teléfono</label>
                      <p className="text-sm text-gray-900">{solicitudSeleccionada.usuario.telefono || 'No proporcionado'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">ID Usuario</label>
                      <p className="text-xs text-gray-600 font-mono">{solicitudSeleccionada.usuario.id}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Vehículo */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Car className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Información del Vehículo</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Vehículo</label>
                      <p className="text-sm text-gray-900 font-medium">
                        {solicitudSeleccionada.vehiculo.marca} {solicitudSeleccionada.vehiculo.modelo}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Año / Color</label>
                      <p className="text-sm text-gray-900">{solicitudSeleccionada.vehiculo.anio} • {solicitudSeleccionada.vehiculo.color}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Placa</label>
                      <p className="text-sm text-gray-900 font-mono">{solicitudSeleccionada.vehiculo.placa}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Categoría</label>
                      <p className="text-sm text-gray-900">{solicitudSeleccionada.vehiculo.categoria.nombre}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Transmisión / Combustible</label>
                      <p className="text-sm text-gray-900">
                        {solicitudSeleccionada.vehiculo.transmision} • {solicitudSeleccionada.vehiculo.tipoCombustible}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Pasajeros / Puertas</label>
                      <p className="text-sm text-gray-900">
                        {solicitudSeleccionada.vehiculo.numeroPasajeros} pasajeros • {solicitudSeleccionada.vehiculo.numeroPuertas} puertas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles de la Renta */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Detalles de la Renta</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Inicio</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {new Date(solicitudSeleccionada.fechaInicio).toLocaleDateString('es-ES', { 
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
                      {new Date(solicitudSeleccionada.fechaFin).toLocaleDateString('es-ES', { 
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
                      {solicitudSeleccionada.diasRenta} {solicitudSeleccionada.diasRenta === 1 ? 'día' : 'días'}
                    </p>
                  </div>
                </div>

                {(solicitudSeleccionada.lugarRecogida || solicitudSeleccionada.lugarEntrega) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {solicitudSeleccionada.lugarRecogida && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Lugar de Recogida</label>
                        <p className="text-sm text-gray-900">{solicitudSeleccionada.lugarRecogida}</p>
                      </div>
                    )}
                    {solicitudSeleccionada.lugarEntrega && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Lugar de Entrega</label>
                        <p className="text-sm text-gray-900">{solicitudSeleccionada.lugarEntrega}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Costos */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Detalles de Pago</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Precio Total</span>
                    <span className="text-lg font-bold text-gray-900">${solicitudSeleccionada.precioTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Depósito Requerido</span>
                    <span className="text-sm font-medium text-gray-900">${solicitudSeleccionada.deposito.toFixed(2)}</span>
                  </div>
                  {solicitudSeleccionada.costoAdicional > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Costo Adicional</span>
                      <span className="text-sm font-medium text-red-600">${solicitudSeleccionada.costoAdicional.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notas */}
              {solicitudSeleccionada.notas && (
                <div className="bg-yellow-50 rounded-lg p-6">
                  <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Notas / Observaciones</label>
                  <p className="text-sm text-gray-900">{solicitudSeleccionada.notas}</p>
                </div>
              )}

              {/* Botón de Descargar Contrato */}
              <div className="flex justify-center pt-4 border-t border-gray-200">
                <button
                  onClick={descargarContrato}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-md"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar Contrato de Alquiler (PDF)</span>
                </button>
              </div>

              {/* Acciones */}
              {solicitudSeleccionada.estado === 'PENDIENTE' && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleRechazar(solicitudSeleccionada.id, `${solicitudSeleccionada.usuario.nombre} ${solicitudSeleccionada.usuario.apellido}`);
                      cerrarDetalle();
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Rechazar</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAprobar(solicitudSeleccionada.id, `${solicitudSeleccionada.usuario.nombre} ${solicitudSeleccionada.usuario.apellido}`);
                      cerrarDetalle();
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Aprobar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
