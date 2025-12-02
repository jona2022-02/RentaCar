import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ClienteSidebar from '@/components/layout/ClienteSidebar';
import { getUsuarioActual } from '@/lib/auth';

export default async function ClienteLayout({ children }: { children: ReactNode }) {
  const usuario = await getUsuarioActual();

  // Si no está autenticado, redirigir al login
  if (!usuario) {
    redirect('/login');
  }

  // Si es admin, redirigir al dashboard de admin
  if (usuario.rol === 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar usuario={usuario} />
      <div className="flex flex-1">
        <ClienteSidebar>
          {children}
        </ClienteSidebar>
      </div>
    </div>
  );
}
