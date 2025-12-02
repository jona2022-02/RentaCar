'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { crearCategoria, actualizarCategoria } from '@/app/actions/admin-categorias';

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  categoria?: Categoria | null;
  onExito: () => void;
}

export default function FormularioCategoria({ abierto, onCerrar, categoria, onExito }: Props) {
  const [cargando, setCargando] = useState(false);
  const [datos, setDatos] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    if (categoria) {
      setDatos({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      });
    } else {
      setDatos({
        nombre: '',
        descripcion: '',
      });
    }
  }, [categoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const resultado = categoria
        ? await actualizarCategoria(categoria.id, datos)
        : await crearCategoria(datos);

      if (resultado.success) {
        onExito();
        onCerrar();
      } else {
        alert(resultado.error || 'Error al guardar la categoría');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la categoría');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              required
              placeholder="Ej: Sedán, SUV, Pickup..."
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={datos.descripcion}
              onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
              rows={3}
              required
              placeholder="Describe las características de esta categoría..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Guardando...' : categoria ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
