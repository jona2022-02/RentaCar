'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Vehiculo } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatearMoneda } from '@/lib/utils';
import { crearReserva } from '@/app/actions/rentas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TarjetaVehiculoProps {
  vehiculo: Vehiculo;
}

export default function TarjetaVehiculo({ vehiculo }: TarjetaVehiculoProps) {
  const router = useRouter();
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const imagenPrincipal = vehiculo.imagenes?.url || '/placeholder-car.jpg';
  
  const [datosReserva, setDatosReserva] = useState({
    fechaInicio: '',
    fechaFin: '',
    lugarRecogida: '',
    lugarEntrega: '',
    notas: '',
    metodoPago: 'EFECTIVO' as 'EFECTIVO' | 'TARJETA',
  });

  const [datosTarjeta, setDatosTarjeta] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: '',
  });

  const calcularDiasYTotal = () => {
    if (!datosReserva.fechaInicio || !datosReserva.fechaFin) return { dias: 0, total: 0 };
    
    const inicio = new Date(datosReserva.fechaInicio);
    const fin = new Date(datosReserva.fechaFin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (dias < 1) return { dias: 0, total: 0 };
    
    const total = Number(vehiculo.precioDia) * dias;
    return { dias, total };
  };

  const handleReservar = async () => {
    if (!datosReserva.fechaInicio || !datosReserva.fechaFin) {
      await Swal.fire({
        icon: 'warning',
        title: 'Fechas requeridas',
        text: 'Por favor selecciona las fechas de inicio y fin',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (datosReserva.metodoPago === 'TARJETA') {
      if (!datosTarjeta.numeroTarjeta || !datosTarjeta.nombreTitular || !datosTarjeta.fechaExpiracion || !datosTarjeta.cvv) {
        await Swal.fire({
          icon: 'warning',
          title: 'Datos de tarjeta incompletos',
          text: 'Por favor completa todos los datos de la tarjeta',
          confirmButtonColor: '#3b82f6',
        });
        return;
      }
    }

    setCargando(true);

    const resultado = await crearReserva({
      vehiculoId: vehiculo.id,
      fechaInicio: new Date(datosReserva.fechaInicio),
      fechaFin: new Date(datosReserva.fechaFin),
      lugarRecogida: datosReserva.lugarRecogida,
      lugarEntrega: datosReserva.lugarEntrega,
      notas: datosReserva.notas,
      metodoPago: datosReserva.metodoPago,
    });

    setCargando(false);

    if (resultado.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Reserva creada!',
        text: resultado.message,
        confirmButtonColor: '#3b82f6',
      });
      setModalReservaAbierto(false);
      setDatosReserva({
        fechaInicio: '',
        fechaFin: '',
        lugarRecogida: '',
        lugarEntrega: '',
        notas: '',
        metodoPago: 'EFECTIVO',
      });
      setDatosTarjeta({
        numeroTarjeta: '',
        nombreTitular: '',
        fechaExpiracion: '',
        cvv: '',
      });
    } else {
      if ((resultado as any).requiresLogin) {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Sesión requerida',
          text: 'Debes iniciar sesión para hacer una reserva',
          showCancelButton: true,
          confirmButtonText: 'Ir a Login',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3b82f6',
          cancelButtonColor: '#6b7280',
        });
        if (result.isConfirmed) {
          router.push('/login');
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: resultado.error,
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  const { dias, total } = calcularDiasYTotal();

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={imagenPrincipal}
            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
            className="w-full h-full object-cover"
          />
          {!vehiculo.disponible && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">No Disponible</Badge>
            </div>
          )}
          {vehiculo.disponible && (
            <Badge className="absolute top-3 right-3 bg-green-600">Disponible</Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {vehiculo.marca} {vehiculo.modelo}
          </h3>
          
          {/* Category */}
          {vehiculo.categoria && (
            <Badge variant="outline" className="mb-3">
              {vehiculo.categoria.nombre}
            </Badge>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Año:</span>
              <span>{vehiculo.anio}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Asientos:</span>
              <span>{vehiculo.numeroPasajeros}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Transmisión:</span>
              <span>{vehiculo.transmision}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Combustible:</span>
              <span>{vehiculo.tipoCombustible}</span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {formatearMoneda(vehiculo.precioDia)}
              </span>
              <span className="text-sm text-gray-500">/ día</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            disabled={!vehiculo.disponible}
            onClick={() => setModalDetallesAbierto(true)}
          >
            {vehiculo.disponible ? 'Ver Detalles' : 'No Disponible'}
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de Detalles */}
      <Dialog open={modalDetallesAbierto} onOpenChange={setModalDetallesAbierto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
            </DialogTitle>
            <DialogDescription>
              Información completa del vehículo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Imagen */}
            <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={imagenPrincipal}
                alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Información general */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-semibold">{vehiculo.categoria?.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-semibold">{vehiculo.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Placa</p>
                <p className="font-semibold">{vehiculo.placa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Año</p>
                <p className="font-semibold">{vehiculo.anio}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pasajeros</p>
                <p className="font-semibold">{vehiculo.numeroPasajeros}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Puertas</p>
                <p className="font-semibold">{vehiculo.numeroPuertas}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transmisión</p>
                <p className="font-semibold">{vehiculo.transmision}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Combustible</p>
                <p className="font-semibold">{vehiculo.tipoCombustible}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aire Acondicionado</p>
                <p className="font-semibold">{vehiculo.tieneAireAcondicionado ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kilometraje</p>
                <p className="font-semibold">{vehiculo.kilometraje} km</p>
              </div>
            </div>

            {/* Descripción */}
            {vehiculo.descripcion && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Descripción</p>
                <p className="text-gray-700">{vehiculo.descripcion}</p>
              </div>
            )}

            {/* Precios */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-3">Precios</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Por Día</p>
                  <p className="text-xl font-bold text-blue-600">{formatearMoneda(vehiculo.precioDia)}</p>
                </div>
                {vehiculo.precioSemana && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Por Semana</p>
                    <p className="text-xl font-bold text-blue-600">{formatearMoneda(vehiculo.precioSemana)}</p>
                  </div>
                )}
                {vehiculo.precioMes && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Por Mes</p>
                    <p className="text-xl font-bold text-blue-600">{formatearMoneda(vehiculo.precioMes)}</p>
                  </div>
                )}
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Depósito Requerido: <span className="font-semibold">{formatearMoneda(vehiculo.depositoRequerido)}</span></p>
              </div>
            </div>

            {/* Botón Reservar */}
            <Button 
              className="w-full h-12 text-lg"
              onClick={() => {
                setModalDetallesAbierto(false);
                setModalReservaAbierto(true);
              }}
            >
              Reservar Ahora
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Reserva */}
      <Dialog open={modalReservaAbierto} onOpenChange={setModalReservaAbierto}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reservar Vehículo</DialogTitle>
            <DialogDescription>
              {vehiculo.marca} {vehiculo.modelo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={datosReserva.fechaInicio}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDatosReserva({ ...datosReserva, fechaInicio: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="fechaFin">Fecha de Fin *</Label>
              <Input
                id="fechaFin"
                type="date"
                value={datosReserva.fechaFin}
                min={datosReserva.fechaInicio || new Date().toISOString().split('T')[0]}
                onChange={(e) => setDatosReserva({ ...datosReserva, fechaFin: e.target.value })}
                required
              />
            </div>

            {dias > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Días de renta:</span>
                  <span className="font-semibold">{dias}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Precio por día:</span>
                  <span className="font-semibold">{formatearMoneda(vehiculo.precioDia)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Depósito:</span>
                  <span className="font-semibold">{formatearMoneda(vehiculo.depositoRequerido)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-blue-600">
                  <span>Total:</span>
                  <span>{formatearMoneda(total)}</span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="lugarRecogida">Lugar de Recogida</Label>
              <Input
                id="lugarRecogida"
                value={datosReserva.lugarRecogida}
                onChange={(e) => setDatosReserva({ ...datosReserva, lugarRecogida: e.target.value })}
                placeholder="Ej: Aeropuerto, Oficina principal..."
              />
            </div>

            <div>
              <Label htmlFor="lugarEntrega">Lugar de Entrega</Label>
              <Input
                id="lugarEntrega"
                value={datosReserva.lugarEntrega}
                onChange={(e) => setDatosReserva({ ...datosReserva, lugarEntrega: e.target.value })}
                placeholder="Ej: Aeropuerto, Oficina principal..."
              />
            </div>

            <div>
              <Label htmlFor="notas">Notas adicionales</Label>
              <Textarea
                id="notas"
                value={datosReserva.notas}
                onChange={(e) => setDatosReserva({ ...datosReserva, notas: e.target.value })}
                placeholder="Información adicional sobre tu reserva..."
                rows={3}
              />
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-lg">Método de Pago</h3>
              
              <div>
                <Label htmlFor="metodoPago">Selecciona el método de pago *</Label>
                <Select
                  value={datosReserva.metodoPago}
                  onValueChange={(value: 'EFECTIVO' | 'TARJETA') => 
                    setDatosReserva({ ...datosReserva, metodoPago: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EFECTIVO">💵 Efectivo (Pago presencial)</SelectItem>
                    <SelectItem value="TARJETA">💳 Tarjeta de Crédito/Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {datosReserva.metodoPago === 'EFECTIVO' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ El pago se realizará en efectivo de forma presencial al momento de recoger el vehículo.
                  </p>
                </div>
              )}

              {datosReserva.metodoPago === 'TARJETA' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-700">Datos de la tarjeta</p>
                  
                  <div>
                    <Label htmlFor="numeroTarjeta">Número de tarjeta *</Label>
                    <Input
                      id="numeroTarjeta"
                      type="text"
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      value={datosTarjeta.numeroTarjeta}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                        setDatosTarjeta({ ...datosTarjeta, numeroTarjeta: formatted });
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombreTitular">Nombre del titular *</Label>
                    <Input
                      id="nombreTitular"
                      type="text"
                      placeholder="Como aparece en la tarjeta"
                      value={datosTarjeta.nombreTitular}
                      onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombreTitular: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fechaExpiracion">Fecha de expiración *</Label>
                      <Input
                        id="fechaExpiracion"
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={datosTarjeta.fechaExpiracion}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setDatosTarjeta({ ...datosTarjeta, fechaExpiracion: value });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={datosTarjeta.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setDatosTarjeta({ ...datosTarjeta, cvv: value });
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800">
                      🔒 Tus datos están protegidos con encriptación SSL
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Tu reserva quedará pendiente de aprobación por parte del administrador.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => setModalReservaAbierto(false)}
                disabled={cargando}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleReservar}
                disabled={cargando || !datosReserva.fechaInicio || !datosReserva.fechaFin}
              >
                {cargando ? 'Procesando...' : 'Confirmar Reserva'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
