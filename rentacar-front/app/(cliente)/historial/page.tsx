'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { obtenerRentas } from '@/app/actions/admin-rentas';
import { obtenerUsuarioActual } from '@/app/actions/usuario';
import { Calendar, Car, DollarSign, Star, Clock, MapPin, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

export default function HistorialPage() {
  const [rentas, setRentas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<string>('TODAS');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    const usuario = await obtenerUsuarioActual();
    if (usuario) {
      // Obtener todas las rentas del usuario
      const { rentas: data } = await obtenerRentas({ 
        usuarioId: usuario.id
      });
      // Filtrar rentas del historial y vigentes (no incluir solo las pendientes)
      const rentasHistorial = data.filter((r: any) => 
        r.estado !== 'PENDIENTE'
      );
      setRentas(rentasHistorial);
    }
    setCargando(false);
  };

  const rentasFiltradas = filtro === 'TODAS' 
    ? rentas 
    : rentas.filter(r => r.estado === filtro);

  const getEstadoBadge = (estado: string) => {
    const configs: any = {
      CONFIRMADA: { color: 'bg-green-100 text-green-800', label: 'Confirmada', icon: CheckCircle },
      EN_CURSO: { color: 'bg-blue-100 text-blue-800', label: 'En Curso', icon: Car },
      COMPLETADA: { color: 'bg-gray-100 text-gray-800', label: 'Completada', icon: CheckCircle },
      CANCELADA: { color: 'bg-red-100 text-red-800', label: 'Cancelada', icon: XCircle },
      RECHAZADA: { color: 'bg-red-100 text-red-800', label: 'Rechazada', icon: XCircle },
    };
    const config = configs[estado] || configs.COMPLETADA;
    const Icon = config.icon;
    return (
      <div className="flex items-center space-x-1">
        <Icon className="w-4 h-4" />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
    );
  };

  const calcularDias = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Rentas</h1>
        <p className="text-gray-600 mt-2">
          {rentas.length > 0 
            ? `Todas tus rentas pasadas (${rentas.length})` 
            : 'No tienes historial de rentas aún'}
        </p>
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
          onClick={() => setFiltro('CONFIRMADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'CONFIRMADA'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Confirmadas ({rentas.filter(r => r.estado === 'CONFIRMADA').length})
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
        <button
          onClick={() => setFiltro('CANCELADA')}
          className={`px-4 py-2 rounded-lg transition ${
            filtro === 'CANCELADA'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Canceladas ({rentas.filter(r => r.estado === 'CANCELADA').length})
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
      </div>

      {rentasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filtro === 'TODAS' 
                ? 'No hay rentas en el historial' 
                : `No hay rentas ${filtro === 'COMPLETADA' ? 'completadas' : filtro === 'CANCELADA' ? 'canceladas' : 'rechazadas'}`
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {filtro === 'TODAS' 
                ? 'Cuando completes, canceles o se rechace una renta, aparecerá aquí' 
                : `No tienes rentas ${filtro.toLowerCase()}`
              }
            </p>
            <Button onClick={() => window.location.href = '/vehiculos'}>
              Explorar Vehículos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rentasFiltradas.map((renta) => (
            <Card key={renta.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagen del vehículo */}
                  <div className="md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {renta.vehiculo?.imagenes && Array.isArray(renta.vehiculo.imagenes) && renta.vehiculo.imagenes.length > 0 ? (
                      <img
                        src={renta.vehiculo.imagenes[0]}
                        alt={renta.vehiculo.marca + ' ' + renta.vehiculo.modelo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Información de la renta */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {renta.vehiculo?.marca} {renta.vehiculo?.modelo} {renta.vehiculo?.anio}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{renta.vehiculo?.ubicacion || 'No especificado'}</span>
                        </div>
                      </div>
                      {getEstadoBadge(renta.estado)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Fechas */}
                      <div className="flex items-start space-x-2">
                        <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Período</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {formatearFecha(renta.fechaInicio)}
                          </p>
                          <p className="font-medium text-gray-900 text-sm">
                            {formatearFecha(renta.fechaFin)}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {calcularDias(renta.fechaInicio, renta.fechaFin)} días
                          </p>
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="flex items-start space-x-2">
                        <DollarSign className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Total pagado</p>
                          <p className="font-bold text-gray-900 text-lg">
                            ${parseFloat(renta.precioTotal).toFixed(2)}
                          </p>
                          {renta.vehiculo?.precioPorDia && (
                            <p className="text-xs text-gray-600">
                              ${parseFloat(renta.vehiculo.precioPorDia).toFixed(2)}/día
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Estado del pago */}
                      <div className="flex items-start space-x-2">
                        <Car className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Método de pago</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {renta.metodoPago === 'TARJETA' && 'Tarjeta de crédito'}
                            {renta.metodoPago === 'EFECTIVO' && 'Efectivo'}
                            {renta.metodoPago === 'TRANSFERENCIA' && 'Transferencia'}
                            {!renta.metodoPago && 'No especificado'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            ID: {renta.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mensaje según estado */}
                    {renta.estado === 'CONFIRMADA' && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800 font-medium">
                            ✅ Renta confirmada - Vigente
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Espera instrucciones para recoger el vehículo el {formatearFecha(renta.fechaInicio)}
                          </p>
                        </div>
                      </div>
                    )}

                    {renta.estado === 'EN_CURSO' && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800 font-medium">
                            🚗 Renta en curso - Activa
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Debes devolver el vehículo el {formatearFecha(renta.fechaFin)}
                          </p>
                        </div>
                      </div>
                    )}

                    {renta.estado === 'CANCELADA' && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800">
                            ❌ Esta renta fue cancelada
                          </p>
                          {renta.notas && (
                            <p className="text-xs text-red-700 mt-1">{renta.notas}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {renta.estado === 'RECHAZADA' && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800 font-medium">
                            ❌ Esta solicitud fue rechazada
                          </p>
                          {renta.notas && (
                            <p className="text-xs text-red-700 mt-1">Motivo: {renta.notas}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Calificación - solo para completadas */}
                    {renta.estado === 'COMPLETADA' && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Calificación:</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (renta.calificacion || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            {renta.calificacion && (
                              <span className="ml-2 text-sm text-gray-600">
                                ({renta.calificacion}/5)
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {!renta.calificacion && (
                          <Button variant="outline" size="sm">
                            Calificar experiencia
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resumen estadístico */}
      {rentas.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumen de tu historial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{rentas.length}</p>
                <p className="text-gray-600 mt-1 text-sm">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {rentas.filter(r => r.estado === 'CONFIRMADA').length}
                </p>
                <p className="text-gray-600 mt-1 text-sm">Confirmadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {rentas.filter(r => r.estado === 'EN_CURSO').length}
                </p>
                <p className="text-gray-600 mt-1 text-sm">En Curso</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {rentas.filter(r => r.estado === 'COMPLETADA').length}
                </p>
                <p className="text-gray-600 mt-1 text-sm">Completadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {rentas.filter(r => r.estado === 'CANCELADA').length}
                </p>
                <p className="text-gray-600 mt-1 text-sm">Canceladas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {rentas.filter(r => r.estado === 'RECHAZADA').length}
                </p>
                <p className="text-gray-600 mt-1 text-sm">Rechazadas</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {rentas.filter(r => ['CONFIRMADA', 'EN_CURSO'].includes(r.estado)).length}
                </p>
                <p className="text-gray-600 mt-1">Rentas vigentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ${rentas.filter(r => ['COMPLETADA', 'EN_CURSO', 'CONFIRMADA'].includes(r.estado)).reduce((sum, r) => sum + parseFloat(r.precioTotal), 0).toFixed(2)}
                </p>
                <p className="text-gray-600 mt-1">Total invertido</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {rentas.filter(r => ['COMPLETADA', 'EN_CURSO', 'CONFIRMADA'].includes(r.estado)).reduce((sum, r) => {
                    const dias = calcularDias(r.fechaInicio, r.fechaFin);
                    return sum + dias;
                  }, 0)}
                </p>
                <p className="text-gray-600 mt-1">Días totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
