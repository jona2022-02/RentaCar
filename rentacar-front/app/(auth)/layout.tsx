import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getUsuarioActual } from '@/lib/auth';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const usuario = await getUsuarioActual();
  
  // Si ya está autenticado, redirigir según su rol
  if (usuario) {
    if (usuario.rol === 'ADMIN') {
      redirect('/dashboard');
    } else {
      redirect('/vehiculos');
    }
  }

  return (
    <>
      {children}
    </>
  );
}
