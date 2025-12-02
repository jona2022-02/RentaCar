'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { logoutAction } from '@/app/actions/auth';

interface NavBarProps {
  usuario?: {
    nombre: string;
    apellido?: string | null;
  } | null;
}

export default function NavBar({ usuario }: NavBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/vehiculos" className="text-xl font-bold text-gray-900">
            RentaCar
          </Link>

          <div className="flex items-center gap-4">
            {usuario ? (
              <>
                <span className="text-sm text-gray-700">
                  Hola, {usuario.nombre} {usuario.apellido || ''}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
