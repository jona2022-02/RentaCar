'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { obtenerRentas } from '@/app/actions/admin-rentas';
import { obtenerUsuarioActual } from '@/app/actions/usuario';
import { cancelarSolicitud } from '@/app/actions/rentas';
import { Calendar, Car, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Eye, X, Download, MapPin, User } from 'lucide-react';
import { generarContratoPDF } from '@/lib/generar-contrato-pdf';

export default function MisRentasPage() {
  const [rentas, setRentas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<string>('TODAS');
  const [rentaSeleccionada, setRentaSeleccionada] = useState<any>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    cargarRentas();
  }, []);

  const cargarRentas = async () => {
    setCargando(true);
    const usuario = await obtenerUsuarioActual();
    if (usuario) {
      const { rentas: data } = await obtenerRentas({ usuarioId: usuario.id });
      setRentas(data);
    }
    setCargando(false);
  };

  const rentasFiltradas = filtro === 'TODAS' 
    ? rentas 
    : rentas.filter(r => r.estado === filtro);

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

  const handleCancelarSolicitud = async (rentaId: string, fromModal: boolean = false) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      return;
    }

    setCancelando(true);
    const resultado = await cancelarSolicitud(rentaId);
    
    if (resultado.success) {
      alert('Solicitud cancelada exitosamente');
      if (fromModal) {
        cerrarDetalle();
      }
      await cargarRentas();
    } else {
      alert(resultado.error || 'Error al cancelar la solicitud');
    }
    setCancelando(false);
  };

  const getEstadoBadge = (estado: string) => {
    const configs: any = {
      PENDIENTE: { color: 'bg-yellow-100 text-yellow-700', label: 'Pendiente', icon: Clock },
      CONFIRMADA: { color: 'bg-green-100 text-green-700', label: 'Aprobada', icon: CheckCircle },
      EN_CURSO: { color: 'bg-blue-100 text-blue-700', label: 'En Curso', icon: Car },
      COMPLETADA: { color: 'bg-gray-100 text-gray-700', label: 'Completada', icon: CheckCircle },
      CANCELADA: { color: 'bg-red-100 text-red-700', label: 'Cancelada', icon: XCircle },
      RECHAZADA: { color: 'bg-red-100 text-red-700', label: 'Rechazada', icon: XCircle },
    };
    const config = configs[estado] || configs.PENDIENTE;
    const Icon = config.icon;
    return (
      <div className="flex items-center space-x-1">
        <Icon className="w-4 h-4" />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando tus rentas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Rentas</h1>
        <p className="text-gray-600 mt-2">Administra tus reservaciones de vehículos ({rentas.length})</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltro('TODAS')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'TODAS'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({rentas.length})
        </button>
        <button
          onClick={() => setFiltro('PENDIENTE')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'PENDIENTE'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pendientes ({rentas.filter(r => r.estado === 'PENDIENTE').length})
        </button>
        <button
          onClick={() => setFiltro('CONFIRMADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'CONFIRMADA'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Aprobadas ({rentas.filter(r => r.estado === 'CONFIRMADA').length})
        </button>
        <button
          onClick={() => setFiltro('RECHAZADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'RECHAZADA'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Rechazadas ({rentas.filter(r => r.estado === 'RECHAZADA').length})
        </button>
        <button
          onClick={() => setFiltro('EN_CURSO')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'EN_CURSO'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          En Curso ({rentas.filter(r => r.estado === 'EN_CURSO').length})
        </button>
        <button
          onClick={() => setFiltro('COMPLETADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'COMPLETADA'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completadas ({rentas.filter(r => r.estado === 'COMPLETADA').length})
        </button>
      </div>

      {/* Lista de Rentas */}
      {rentasFiltradas.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            {filtro === 'TODAS' 
              ? 'No tienes rentas registradas' 
              : `No tienes rentas ${filtro === 'PENDIENTE' ? 'pendientes' : filtro === 'CONFIRMADA' ? 'aprobadas' : filtro === 'RECHAZADA' ? 'rechazadas' : filtro.toLowerCase()}`
            }
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rentasFiltradas.map((renta) => (
            <Card key={renta.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Imagen del vehículo - más pequeña */}
                  {renta.vehiculo.imagenes?.url && (
                    <img 
                      src={renta.vehiculo.imagenes.url} 
                      alt={`${renta.vehiculo.marca} ${renta.vehiculo.modelo}`}
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  
                  {/* Información principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          {renta.vehiculo.marca} {renta.vehiculo.modelo}
                        </h3>
                        <p className="text-sm text-gray-500">{renta.vehiculo.anio} • {renta.vehiculo.placa}</p>
                      </div>
                      {getEstadoBadge(renta.estado)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Inicio
                        </div>
                        <p className="text-sm font-semibold">{new Date(renta.fechaInicio).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short'
                        })}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Fin
                        </div>
                        <p className="text-sm font-semibold">{new Date(renta.fechaFin).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short'
                        })}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          Duración
                        </div>
                        <p className="text-sm font-semibold">{renta.diasRenta} {renta.diasRenta === 1 ? 'día' : 'días'}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Total
                        </div>
                        <p className="text-sm font-semibold text-green-600">${renta.precioTotal.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Información adicional según estado - más compacta */}
                    {renta.estado === 'PENDIENTE' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                        <p className="text-xs text-yellow-800">
                          ⏳ Tu solicitud está siendo revisada
                        </p>
                      </div>
                    )}

                    {renta.estado === 'CONFIRMADA' && (
                      <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
                        <p className="text-xs text-green-800">
                          ✅ Reserva aprobada
                        </p>
                      </div>
                    )}

                    {renta.estado === 'RECHAZADA' && renta.notas && (
                      <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                        <p className="text-xs text-red-800">❌ Rechazada: {renta.notas}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => abrirDetalle(renta)}>
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Detalles
                      </Button>
                      {renta.estado === 'PENDIENTE' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleCancelarSolicitud(renta.id, false)}
                          disabled={cancelando}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          {cancelando ? 'Cancelando...' : 'Cancelar'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalles */}
      {modalAbierto && rentaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Detalles de tu Renta</h2>
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
                <h3 className="text-lg font-semibold text-gray-900">Estado</h3>
                <div className="text-lg">
                  {getEstadoBadge(rentaSeleccionada.estado)}
                </div>
              </div>

              {/* Vehículo */}
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Car className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Vehículo Rentado</h3>
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
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Combustible</label>
                    <p className="text-sm text-gray-900">{rentaSeleccionada.vehiculo.tipoCombustible}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Capacidad</label>
                    <p className="text-sm text-gray-900">{rentaSeleccionada.vehiculo.numeroPasajeros} pasajeros</p>
                  </div>
                </div>
              </div>

              {/* Periodo de Renta */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-green-200">
                    {rentaSeleccionada.lugarRecogida && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          Lugar de Recogida
                        </label>
                        <p className="text-sm text-gray-900">{rentaSeleccionada.lugarRecogida}</p>
                      </div>
                    )}
                    {rentaSeleccionada.lugarEntrega && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          Lugar de Entrega
                        </label>
                        <p className="text-sm text-gray-900">{rentaSeleccionada.lugarEntrega}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Detalles Financieros */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-6 h-6 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Detalles de Pago</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Precio Total</span>
                    <span className="text-lg font-bold text-gray-900">${rentaSeleccionada.precioTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Depósito Requerido</span>
                    <span className="text-sm font-medium text-gray-900">${rentaSeleccionada.deposito.toFixed(2)}</span>
                  </div>
                  {rentaSeleccionada.costoAdicional > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Costo Adicional</span>
                        <span className="text-sm font-medium text-red-600">${rentaSeleccionada.costoAdicional.toFixed(2)}</span>
                      </div>
                      {rentaSeleccionada.razonAdicional && (
                        <p className="text-xs text-gray-500 italic">Motivo: {rentaSeleccionada.razonAdicional}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Mensajes según estado */}
              {rentaSeleccionada.estado === 'PENDIENTE' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⏳ Tu solicitud está siendo revisada por el administrador. Te notificaremos cuando sea aprobada.
                  </p>
                </div>
              )}

              {rentaSeleccionada.estado === 'CONFIRMADA' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    ✅ ¡Tu reserva ha sido aprobada!
                  </p>
                  <p className="text-sm text-green-700">
                    Puedes descargar tu contrato de arrendamiento y espera instrucciones para recoger el vehículo en las fechas indicadas.
                  </p>
                </div>
              )}

              {rentaSeleccionada.estado === 'RECHAZADA' && rentaSeleccionada.notas && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium mb-1">❌ Solicitud Rechazada</p>
                  <p className="text-sm text-red-700">Motivo: {rentaSeleccionada.notas}</p>
                </div>
              )}

              {/* Notas */}
              {rentaSeleccionada.notas && rentaSeleccionada.estado !== 'RECHAZADA' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Notas / Observaciones</label>
                  <p className="text-sm text-gray-900">{rentaSeleccionada.notas}</p>
                </div>
              )}

              {/* Botón de Descargar Contrato */}
              {(rentaSeleccionada.estado === 'CONFIRMADA' || rentaSeleccionada.estado === 'EN_CURSO' || rentaSeleccionada.estado === 'COMPLETADA') && (
                <div className="flex justify-center pt-4 border-t border-gray-200">
                  <button
                    onClick={descargarContrato}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-md"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar Contrato de Arrendamiento (PDF)</span>
                  </button>
                </div>
              )}

              {/* Botón de Cancelar desde el Modal */}
              {rentaSeleccionada.estado === 'PENDIENTE' && (
                <div className="flex justify-center pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleCancelarSolicitud(rentaSeleccionada.id, true)}
                    disabled={cancelando}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>{cancelando ? 'Cancelando...' : 'Cancelar Solicitud'}</span>
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
