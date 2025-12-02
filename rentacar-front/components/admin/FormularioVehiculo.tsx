'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { crearVehiculo, actualizarVehiculo, obtenerCategorias } from '@/app/actions/admin-vehiculos';
import { Upload, X, Loader2 } from 'lucide-react';

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
  imagenes?: { url: string } | null;
  precioDia: number;
  precioSemana?: number | null;
  precioMes?: number | null;
  depositoRequerido: number;
  kilometraje: number;
  disponible: boolean;
  categoriaId: string;
}

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  vehiculo?: Vehiculo | null;
  onExito: () => void;
}

export default function FormularioVehiculo({ abierto, onCerrar, vehiculo, onExito }: Props) {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [datos, setDatos] = useState<{
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    placa: string;
    transmision: string;
    tipoCombustible: string;
    numeroPasajeros: number;
    numeroPuertas: number;
    descripcion: string;
    imagenes: { url: string } | null;
    precioDia: number;
    precioSemana: number;
    precioMes: number;
    depositoRequerido: number;
    kilometraje: number;
    disponible: boolean;
    categoriaId: string;
  }>({
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    color: '',
    placa: '',
    transmision: 'MANUAL',
    tipoCombustible: 'GASOLINA',
    numeroPasajeros: 5,
    numeroPuertas: 4,
    descripcion: '',
    imagenes: null,
    precioDia: 0,
    precioSemana: 0,
    precioMes: 0,
    depositoRequerido: 0,
    kilometraje: 0,
    disponible: true,
    categoriaId: '',
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (vehiculo) {
      setDatos({
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        color: vehiculo.color,
        placa: vehiculo.placa,
        transmision: vehiculo.transmision,
        tipoCombustible: vehiculo.tipoCombustible,
        numeroPasajeros: vehiculo.numeroPasajeros,
        numeroPuertas: vehiculo.numeroPuertas,
        descripcion: vehiculo.descripcion || '',
        imagenes: vehiculo.imagenes || null,
        precioDia: vehiculo.precioDia,
        precioSemana: vehiculo.precioSemana || 0,
        precioMes: vehiculo.precioMes || 0,
        depositoRequerido: vehiculo.depositoRequerido,
        kilometraje: vehiculo.kilometraje,
        disponible: vehiculo.disponible,
        categoriaId: vehiculo.categoriaId,
      });
    } else {
      // Reset al crear nuevo
      setDatos({
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        color: '',
        placa: '',
        transmision: 'MANUAL',
        tipoCombustible: 'GASOLINA',
        numeroPasajeros: 5,
        numeroPuertas: 4,
        descripcion: '',
        imagenes: null,
        precioDia: 0,
        precioSemana: 0,
        precioMes: 0,
        depositoRequerido: 0,
        kilometraje: 0,
        disponible: true,
        categoriaId: '',
      });
    }
  }, [vehiculo]);

  const cargarCategorias = async () => {
    const resultado = await obtenerCategorias();
    if (resultado.success) {
      setCategorias(resultado.categorias);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no debe superar 10MB');
      return;
    }

    setSubiendoImagen(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'rentacar_vehiculos');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcceooqha/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setDatos({ ...datos, imagenes: { url: data.secure_url } });
      } else {
        console.error('Cloudinary error:', data);
        alert('Error al subir la imagen: ' + (data.error?.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const datosVehiculo = {
        ...datos,
        precioSemana: datos.precioSemana || null,
        precioMes: datos.precioMes || null,
        descripcion: datos.descripcion || null,
        imagenes: datos.imagenes,
      };

      const resultado = vehiculo
        ? await actualizarVehiculo(vehiculo.id, datosVehiculo)
        : await crearVehiculo(datosVehiculo);

      if (resultado.success) {
        onExito();
        onCerrar();
      } else {
        alert(resultado.error || 'Error al guardar el vehículo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el vehículo');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marca">Marca *</Label>
              <Input
                id="marca"
                value={datos.marca}
                onChange={(e) => setDatos({ ...datos, marca: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                value={datos.modelo}
                onChange={(e) => setDatos({ ...datos, modelo: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="anio">Año *</Label>
              <Input
                id="anio"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={datos.anio}
                onChange={(e) => setDatos({ ...datos, anio: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                value={datos.color}
                onChange={(e) => setDatos({ ...datos, color: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="placa">Placa *</Label>
              <Input
                id="placa"
                value={datos.placa}
                onChange={(e) => setDatos({ ...datos, placa: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="categoriaId">Categoría *</Label>
              <Select value={datos.categoriaId} onValueChange={(value) => setDatos({ ...datos, categoriaId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transmision">Transmisión *</Label>
              <Select value={datos.transmision} onValueChange={(value) => setDatos({ ...datos, transmision: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="AUTOMATICA">Automática</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipoCombustible">Combustible *</Label>
              <Select value={datos.tipoCombustible} onValueChange={(value) => setDatos({ ...datos, tipoCombustible: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GASOLINA">Gasolina</SelectItem>
                  <SelectItem value="DIESEL">Diésel</SelectItem>
                  <SelectItem value="ELECTRICO">Eléctrico</SelectItem>
                  <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numeroPasajeros">Pasajeros *</Label>
              <Input
                id="numeroPasajeros"
                type="number"
                min="1"
                max="20"
                value={datos.numeroPasajeros}
                onChange={(e) => setDatos({ ...datos, numeroPasajeros: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="numeroPuertas">Puertas *</Label>
              <Input
                id="numeroPuertas"
                type="number"
                min="2"
                max="6"
                value={datos.numeroPuertas}
                onChange={(e) => setDatos({ ...datos, numeroPuertas: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="kilometraje">Kilometraje *</Label>
              <Input
                id="kilometraje"
                type="number"
                min="0"
                value={datos.kilometraje}
                onChange={(e) => setDatos({ ...datos, kilometraje: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="precioDia">Precio/Día ($) *</Label>
              <Input
                id="precioDia"
                type="number"
                step="0.01"
                min="0"
                value={datos.precioDia}
                onChange={(e) => setDatos({ ...datos, precioDia: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="precioSemana">Precio/Semana ($)</Label>
              <Input
                id="precioSemana"
                type="number"
                step="0.01"
                min="0"
                value={datos.precioSemana}
                onChange={(e) => setDatos({ ...datos, precioSemana: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="precioMes">Precio/Mes ($)</Label>
              <Input
                id="precioMes"
                type="number"
                step="0.01"
                min="0"
                value={datos.precioMes}
                onChange={(e) => setDatos({ ...datos, precioMes: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="depositoRequerido">Depósito ($) *</Label>
              <Input
                id="depositoRequerido"
                type="number"
                step="0.01"
                min="0"
                value={datos.depositoRequerido}
                onChange={(e) => setDatos({ ...datos, depositoRequerido: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="disponible">Estado *</Label>
              <Select value={datos.disponible.toString()} onValueChange={(value) => setDatos({ ...datos, disponible: value === 'true' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Disponible</SelectItem>
                  <SelectItem value="false">No disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={datos.descripcion}
              onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
              rows={3}
              placeholder="Descripción del vehículo..."
            />
          </div>

          {/* URL de Imagen */}
          <div>
            <Label htmlFor="imagenUrl">URL de Imagen</Label>
            <Input
              id="imagenUrl"
              type="url"
              value={datos.imagenes?.url || ''}
              onChange={(e) => setDatos({ ...datos, imagenes: e.target.value ? { url: e.target.value } : null })}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {datos.imagenes?.url && (
              <div className="mt-3 relative">
                <img 
                  src={datos.imagenes.url} 
                  alt="Vista previa" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setDatos({ ...datos, imagenes: null })}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Guardando...' : vehiculo ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
