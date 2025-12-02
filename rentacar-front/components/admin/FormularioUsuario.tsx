'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { crearUsuario, actualizarUsuario } from '@/app/actions/admin-usuarios';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  numeroLicencia?: string | null;
  rol: string;
  estado: string;
}

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  usuario?: Usuario | null;
  onExito: () => void;
}

export default function FormularioUsuario({ abierto, onCerrar, usuario, onExito }: Props) {
  const [cargando, setCargando] = useState(false);
  const [datos, setDatos] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    numeroLicencia: '',
    rol: 'CLIENTE' as 'CLIENTE' | 'ADMIN',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO',
  });

  useEffect(() => {
    if (usuario) {
      setDatos({
        email: usuario.email,
        password: '', // No mostrar password
        nombre: usuario.nombre,
        apellido: usuario.apellido || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        ciudad: usuario.ciudad || '',
        pais: usuario.pais || '',
        numeroLicencia: usuario.numeroLicencia || '',
        rol: usuario.rol as 'CLIENTE' | 'ADMIN',
        estado: usuario.estado as 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO',
      });
    } else {
      setDatos({
        email: '',
        password: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        pais: '',
        numeroLicencia: '',
        rol: 'CLIENTE',
        estado: 'ACTIVO',
      });
    }
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const resultado = usuario
        ? await actualizarUsuario(usuario.id, datos)
        : await crearUsuario(datos);

      if (resultado.success) {
        onExito();
        onCerrar();
      } else {
        alert(resultado.error || 'Error al guardar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={datos.nombre}
                onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={datos.apellido}
                onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={datos.email}
                onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                required
                disabled={!!usuario} // No permitir cambiar email al editar
              />
            </div>

            <div>
              <Label htmlFor="password">
                {usuario ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
              </Label>
              <Input
                id="password"
                type="password"
                value={datos.password}
                onChange={(e) => setDatos({ ...datos, password: e.target.value })}
                required={!usuario}
                placeholder={usuario ? 'Dejar vacío para no cambiar' : ''}
              />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={datos.telefono}
                onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                placeholder="+52 55 1234 5678"
              />
            </div>

            <div>
              <Label htmlFor="numeroLicencia">Número de Licencia</Label>
              <Input
                id="numeroLicencia"
                value={datos.numeroLicencia}
                onChange={(e) => setDatos({ ...datos, numeroLicencia: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={datos.ciudad}
                onChange={(e) => setDatos({ ...datos, ciudad: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                value={datos.pais}
                onChange={(e) => setDatos({ ...datos, pais: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={datos.direccion}
                onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="rol">Rol *</Label>
              <Select value={datos.rol} onValueChange={(value: 'CLIENTE' | 'ADMIN') => setDatos({ ...datos, rol: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENTE">Cliente</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Select 
                value={datos.estado} 
                onValueChange={(value: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO') => setDatos({ ...datos, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVO">Activo</SelectItem>
                  <SelectItem value="INACTIVO">Inactivo</SelectItem>
                  <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
