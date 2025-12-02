'use client';

import { useState, useEffect, useMemo } from 'react';
import { obtenerVehiculos } from '@/app/actions/vehiculos';
import { Vehiculo, FiltrosVehiculo, Transmision, TipoCombustible } from '@/types';
import TarjetaVehiculo from '@/components/vehiculos/TarjetaVehiculo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VehiculosPage() {
  const [todosVehiculos, setTodosVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosVehiculo>({
    disponible: true,
  });

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setCargando(true);
      const resultado = await obtenerVehiculos(true); // Solo disponibles
      if (resultado.success) {
        setTodosVehiculos(resultado.vehiculos as any);
      }
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar vehículos en el cliente
  const vehiculosFiltrados = useMemo(() => {
    return todosVehiculos.filter((vehiculo) => {
      // Filtro de búsqueda
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const coincide = 
          vehiculo.marca.toLowerCase().includes(busqueda) ||
          vehiculo.modelo.toLowerCase().includes(busqueda);
        if (!coincide) return false;
      }

      // Filtro de transmisión
      if (filtros.transmision && vehiculo.transmision !== filtros.transmision) {
        return false;
      }

      // Filtro de combustible
      if (filtros.tipoCombustible && vehiculo.tipoCombustible !== filtros.tipoCombustible) {
        return false;
      }

      // Filtro de asientos
      if (filtros.numeroPasajeros && vehiculo.numeroPasajeros !== filtros.numeroPasajeros) {
        return false;
      }

      // Filtro de disponibilidad
      if (filtros.disponible !== undefined && vehiculo.disponible !== filtros.disponible) {
        return false;
      }

      return true;
    });
  }, [todosVehiculos, filtros]);

  const actualizarFiltro = (campo: keyof FiltrosVehiculo, valor: any) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor || undefined,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({ disponible: true });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Nuestros Vehículos</h1>
        <p className="text-gray-600">Encuentra el vehículo perfecto para tu viaje</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Marca o modelo..."
                value={filtros.busqueda || ''}
                onChange={(e) => actualizarFiltro('busqueda', e.target.value)}
              />
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <Label>Transmisión</Label>
              <Select
                value={filtros.transmision || 'all'}
                onValueChange={(value) => actualizarFiltro('transmision', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="AUTOMATICA">Automática</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <Label>Combustible</Label>
              <Select
                value={filtros.tipoCombustible || 'all'}
                onValueChange={(value) => actualizarFiltro('tipoCombustible', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="GASOLINA">Gasolina</SelectItem>
                  <SelectItem value="DIESEL">Diesel</SelectItem>
                  <SelectItem value="ELECTRICO">Eléctrico</SelectItem>
                  <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seats */}
            <div className="space-y-2">
              <Label>Asientos</Label>
              <Select
                value={filtros.numeroPasajeros?.toString() || 'all'}
                onValueChange={(value) => actualizarFiltro('numeroPasajeros', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="2">2 asientos</SelectItem>
                  <SelectItem value="4">4 asientos</SelectItem>
                  <SelectItem value="5">5 asientos</SelectItem>
                  <SelectItem value="7">7 asientos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-96 animate-pulse bg-gray-200" />
          ))}
        </div>
      ) : vehiculosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No se encontraron vehículos con los filtros seleccionados</p>
          <Button onClick={limpiarFiltros} className="mt-4">
            Ver todos los vehículos
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            {vehiculosFiltrados.length} {vehiculosFiltrados.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculosFiltrados.map((vehiculo) => (
              <TarjetaVehiculo key={vehiculo.id} vehiculo={vehiculo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
