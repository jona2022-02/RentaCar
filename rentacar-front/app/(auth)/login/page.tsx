'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [datos, setDatos] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const resultado = await loginAction(datos.email, datos.password);
      
      if (!resultado.success) {
        setError(resultado.error || 'Error al iniciar sesión');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">RC</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RentaCar</h1>
          <p className="text-gray-600 text-lg">Acceso al Sistema</p>
        </div>

        <Card className="bg-white border-0 shadow-xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-gray-900 text-center font-bold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={datos.email}
                  onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                  required
                  className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={cargando}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={datos.password}
                  onChange={(e) => setDatos({ ...datos, password: e.target.value })}
                  required
                  className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={cargando}
                />
              </div>

              <Button
                type="submit"
                disabled={cargando}
                className="w-full h-11 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="text-center space-y-3 pt-4 border-t border-gray-200">
              <Link 
                href="/registro" 
                className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ¿No tienes cuenta? Regístrate aquí →
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2025 RentaCar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

