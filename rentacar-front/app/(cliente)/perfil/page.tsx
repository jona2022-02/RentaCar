'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { obtenerUsuarioActual } from '@/app/actions/usuario';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    ciudad: '',
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setCargando(true);
    const usuarioActual = await obtenerUsuarioActual();
    if (usuarioActual) {
      setUsuario(usuarioActual);
      setDatos({
        nombre: usuarioActual.nombre || '',
        apellido: usuarioActual.apellido || '',
        telefono: usuarioActual.telefono || '',
        direccion: usuarioActual.direccion || '',
        ciudad: usuarioActual.ciudad || '',
      });
    }
    setCargando(false);
  };

  const handleGuardar = async () => {
    // Aquí irá la lógica para actualizar el perfil
    alert('Funcionalidad de actualización próximamente');
    setEditando(false);
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando perfil...</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
      </div>

      <div className="grid gap-6">
        {/* Avatar y nombre */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-6 h-6 text-blue-600" />
                <span>Información Personal</span>
              </CardTitle>
              {!editando ? (
                <Button onClick={() => setEditando(true)} variant="outline">
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => setEditando(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button onClick={handleGuardar}>
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email (no editable) */}
            <div>
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={usuario.email}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={datos.nombre}
                  onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                  disabled={!editando}
                  className="mt-1"
                />
              </div>

              {/* Apellido */}
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={datos.apellido}
                  onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
                  disabled={!editando}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="telefono" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Teléfono</span>
              </Label>
              <Input
                id="telefono"
                value={datos.telefono}
                onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                disabled={!editando}
                className="mt-1"
              />
            </div>

            {/* Dirección */}
            <div>
              <Label htmlFor="direccion" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Dirección</span>
              </Label>
              <Input
                id="direccion"
                value={datos.direccion}
                onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
                disabled={!editando}
                className="mt-1"
              />
            </div>

            {/* Ciudad */}
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={datos.ciudad}
                onChange={(e) => setDatos({ ...datos, ciudad: e.target.value })}
                disabled={!editando}
                className="mt-1"
              />
            </div>

            {/* Información de cuenta */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Información de la Cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Rol</p>
                  <p className="font-medium text-gray-900">{usuario.rol}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estado</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      usuario.estado === 'ACTIVO' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.estado}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
