'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { RolUsuario } from '@/types';

interface RutaProtegidaProps {
  children: React.ReactNode;
  rolesPermitidos?: RolUsuario[];
  redirectTo?: string;
}

export function RutaProtegida({ 
  children, 
  rolesPermitidos = [RolUsuario.CLIENTE, RolUsuario.ADMIN],
  redirectTo = '/login' 
}: RutaProtegidaProps) {
  const router = useRouter();
  const { usuario, estaAutenticado } = useAuthStore();

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!estaAutenticado) {
      router.push(redirectTo);
      return;
    }

    // Si está autenticado pero no tiene el rol permitido
    if (usuario && !rolesPermitidos.includes(usuario.rol)) {
      // Redirigir según el rol
      if (usuario.rol === RolUsuario.ADMIN) {
        router.push('/admin/dashboard');
      } else {
        router.push('/vehiculos');
      }
    }
  }, [estaAutenticado, usuario, rolesPermitidos, redirectTo, router]);

  // Si no está autenticado o no tiene el rol correcto, no mostrar nada
  if (!estaAutenticado || (usuario && !rolesPermitidos.includes(usuario.rol))) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
