'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { registrarAction } from '@/app/actions/auth';

export default function RegistroPage() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmarPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar contraseñas
    if (datos.password !== datos.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (datos.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      const resultado = await registrarAction({
        nombre: datos.nombre,
        apellido: datos.apellido || undefined,
        email: datos.email,
        telefono: datos.telefono || undefined,
        password: datos.password,
      });

      if (!resultado.success) {
        setError(resultado.error || 'Error al registrarse');
      }
      // Si es exitoso, la redirección se hace automáticamente en registrarAction
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Regístrate para comenzar a rentar vehículos
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  placeholder="Juan"
                  value={datos.nombre}
                  onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                  required
                  disabled={cargando}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  placeholder="Pérez"
                  value={datos.apellido}
                  onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
                  disabled={cargando}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={datos.email}
                onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                required
                disabled={cargando}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="555-1234-5678"
                value={datos.telefono}
                onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                disabled={cargando}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={datos.password}
                onChange={(e) => setDatos({ ...datos, password: e.target.value })}
                required
                disabled={cargando}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarPassword">Confirmar Contraseña *</Label>
              <Input
                id="confirmarPassword"
                type="password"
                placeholder="••••••••"
                value={datos.confirmarPassword}
                onChange={(e) => setDatos({ ...datos, confirmarPassword: e.target.value })}
                required
                disabled={cargando}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Registrarse'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
