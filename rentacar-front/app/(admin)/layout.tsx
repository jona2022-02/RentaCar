import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { getUsuarioActual } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const usuario = await getUsuarioActual();
  
  // Si no está autenticado, redirigir al login
  if (!usuario) {
    redirect('/login');
  }
  
  // Si es cliente, redirigir a la vista de clientes
  if (usuario.rol === 'CLIENTE') {
    redirect('/vehiculos');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar usuario={usuario} />
      <div className="flex flex-1">
        <AdminSidebar>
          {children}
        </AdminSidebar>
      </div>
    </div>
  );
}
