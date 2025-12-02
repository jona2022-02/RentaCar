'use client';

import { useState, useEffect } from 'react';
import { obtenerVehiculos } from '@/app/actions/vehiculos';
import { eliminarVehiculo, cambiarDisponibilidadVehiculo } from '@/app/actions/admin-vehiculos';
import FormularioVehiculo from '@/components/admin/FormularioVehiculo';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  placa: string;
  transmision: string;
  tipoCombustible: string;
  numeroPasajeros: number;
  numeroPuertas: number;
  descripcion?: string | null;
  imagenUrl?: string | null;
  precioDia: number;
  precioSemana?: number | null;
  precioMes?: number | null;
  depositoRequerido: number;
  kilometraje: number;
  disponible: boolean;
  categoriaId: string;
  categoria?: any;
}

export default function AdminVehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState<Vehiculo | null>(null);
  const [eliminarDialogAbierto, setEliminarDialogAbierto] = useState(false);
  const [vehiculoEliminar, setVehiculoEliminar] = useState<string | null>(null);
  
  // Paginación y filtros
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>('todos');
  const [filtroTransmision, setFiltroTransmision] = useState<string>('todos');
  const vehiculosPorPagina = 10;

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setCargando(true);
      const resultado = await obtenerVehiculos(false); // Todos los vehículos
      if (resultado.success) {
        setVehiculos(resultado.vehiculos as any);
      }
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleNuevoVehiculo = () => {
    setVehiculoEditar(null);
    setModalAbierto(true);
  };

  const handleEditarVehiculo = (vehiculo: Vehiculo) => {
    setVehiculoEditar(vehiculo);
    setModalAbierto(true);
  };

  const handleEliminarClick = (id: string) => {
    setVehiculoEliminar(id);
    setEliminarDialogAbierto(true);
  };

  const handleEliminarConfirmar = async () => {
    if (!vehiculoEliminar) return;

    try {
      const resultado = await eliminarVehiculo(vehiculoEliminar);
      if (resultado.success) {
        await cargarVehiculos();
        setEliminarDialogAbierto(false);
        setVehiculoEliminar(null);
      } else {
        alert(resultado.error || 'Error al eliminar el vehículo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el vehículo');
    }
  };

  const handleCambiarDisponibilidad = async (id: string, disponible: boolean) => {
    try {
      const resultado = await cambiarDisponibilidadVehiculo(id, disponible);
      if (resultado.success) {
        await cargarVehiculos();
      } else {
        alert(resultado.error || 'Error al cambiar disponibilidad');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar disponibilidad');
    }
  };

  // Filtrar vehículos
  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const matchBusqueda = busqueda === '' || 
      vehiculo.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.placa.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchDisponibilidad = filtroDisponibilidad === 'todos' ||
      (filtroDisponibilidad === 'disponible' && vehiculo.disponible) ||
      (filtroDisponibilidad === 'no-disponible' && !vehiculo.disponible);
    
    const matchTransmision = filtroTransmision === 'todos' ||
      vehiculo.transmision === filtroTransmision;
    
    return matchBusqueda && matchDisponibilidad && matchTransmision;
  });

  // Paginación
  const totalPaginas = Math.ceil(vehiculosFiltrados.length / vehiculosPorPagina);
  const indiceInicio = (paginaActual - 1) * vehiculosPorPagina;
  const indiceFin = indiceInicio + vehiculosPorPagina;
  const vehiculosPaginados = vehiculosFiltrados.slice(indiceInicio, indiceFin);

  // Reset página cuando cambian filtros
  const handleBusquedaChange = (valor: string) => {
    setBusqueda(valor);
    setPaginaActual(1);
  };

  const handleFiltroChange = (tipo: 'disponibilidad' | 'transmision', valor: string) => {
    if (tipo === 'disponibilidad') setFiltroDisponibilidad(valor);
    if (tipo === 'transmision') setFiltroTransmision(valor);
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroDisponibilidad('todos');
    setFiltroTransmision('todos');
    setPaginaActual(1);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Vehículos</CardTitle>
              <CardDescription>Administra el inventario de vehículos disponibles</CardDescription>
            </div>
            <Button onClick={handleNuevoVehiculo}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Vehículo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por marca, modelo o placa..."
                  value={busqueda}
                  onChange={(e) => handleBusquedaChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filtroDisponibilidad} onValueChange={(v) => handleFiltroChange('disponibilidad', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las disponibilidades</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="no-disponible">No disponible</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroTransmision} onValueChange={(v) => handleFiltroChange('transmision', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Transmisión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las transmisiones</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="AUTOMATICA">Automática</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar Filtros
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Mostrando {vehiculosPaginados.length} de {vehiculosFiltrados.length} vehículos
            </div>
          </div>

          {vehiculos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay vehículos registrados</p>
              <Button onClick={handleNuevoVehiculo} className="mt-4">
                Agregar primer vehículo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Transmisión</TableHead>
                    <TableHead>Combustible</TableHead>
                    <TableHead>Pasajeros</TableHead>
                    <TableHead>Precio/Día</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculosPaginados.map((vehiculo) => (
                    <TableRow key={vehiculo.id}>
                      <TableCell className="font-medium">
                        {vehiculo.marca} {vehiculo.modelo}
                        <div className="text-sm text-gray-500">{vehiculo.color}</div>
                      </TableCell>
                      <TableCell>{vehiculo.placa}</TableCell>
                      <TableCell>{vehiculo.anio}</TableCell>
                      <TableCell>
                        {vehiculo.transmision === 'AUTOMATICA' ? 'Automática' : 'Manual'}
                      </TableCell>
                      <TableCell>
                        {vehiculo.tipoCombustible === 'GASOLINA' ? 'Gasolina' :
                         vehiculo.tipoCombustible === 'DIESEL' ? 'Diésel' :
                         vehiculo.tipoCombustible === 'ELECTRICO' ? 'Eléctrico' : 'Híbrido'}
                      </TableCell>
                      <TableCell>{vehiculo.numeroPasajeros}</TableCell>
                      <TableCell>${vehiculo.precioDia}</TableCell>
                      <TableCell>
                        <Badge variant={vehiculo.disponible ? 'default' : 'secondary'}>
                          {vehiculo.disponible ? 'Disponible' : 'No disponible'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCambiarDisponibilidad(vehiculo.id, !vehiculo.disponible)}
                            title={vehiculo.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                          >
                            {vehiculo.disponible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditarVehiculo(vehiculo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEliminarClick(vehiculo.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginador */}
          {vehiculosFiltrados.length > 0 && totalPaginas > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Página {paginaActual} de {totalPaginas}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter(num => {
                      // Mostrar primera, última y páginas cercanas a la actual
                      return num === 1 || 
                             num === totalPaginas || 
                             (num >= paginaActual - 1 && num <= paginaActual + 1);
                    })
                    .map((num, idx, arr) => {
                      // Agregar puntos suspensivos si hay salto
                      const items = [];
                      if (idx > 0 && num - arr[idx - 1] > 1) {
                        items.push(
                          <span key={`ellipsis-${num}`} className="px-2 py-1 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      items.push(
                        <Button
                          key={num}
                          variant={paginaActual === num ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPaginaActual(num)}
                          className="w-10"
                        >
                          {num}
                        </Button>
                      );
                      return items;
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FormularioVehiculo
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        vehiculo={vehiculoEditar}
        onExito={cargarVehiculos}
      />

      <AlertDialog open={eliminarDialogAbierto} onOpenChange={setEliminarDialogAbierto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El vehículo será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVehiculoEliminar(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarConfirmar} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
