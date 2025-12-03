'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminSidebar({ children }: { children: ReactNode }) {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  return (
    <div className="flex flex-1 relative">
      {/* Sidebar Desktop */}
      <aside 
        style={{ width: sidebarAbierto ? '256px' : '64px' }}
        className="hidden lg:flex flex-col bg-white border-r border-gray-200 text-gray-700 transition-all duration-300 ease-in-out sticky top-0 self-start"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          {sidebarAbierto && (
            <h2 className="text-lg font-bold whitespace-nowrap overflow-hidden">Panel Admin</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            className="text-gray-700 hover:bg-gray-50 active:bg-blue-50 shrink-0"
          >
            {sidebarAbierto ? '←' : '→'}
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Dashboard</span>}
          </Link>
          <Link 
            href="/admin-vehiculos" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Vehículos</span>}
          </Link>
          <Link 
            href="/rentas" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Rentas</span>}
          </Link>
          <Link 
            href="/usuarios" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Usuarios</span>}
          </Link>
          <Link 
            href="/categorias" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Categorías</span>}
          </Link>
          <Link 
            href="/solicitudes" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Solicitudes</span>}
          </Link>
        </nav>
      </aside>

      {/* Sidebar móvil */}
      <aside 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 text-gray-700 z-40 lg:hidden transition-transform duration-300 ${
          sidebarAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-bold">Panel Admin</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarAbierto(false)}
            className="text-gray-700 hover:bg-gray-50 active:bg-blue-50"
          >
            ✕
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/admin-vehiculos" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>Vehículos</span>
          </Link>
          <Link 
            href="/rentas" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Rentas</span>
          </Link>
          <Link 
            href="/usuarios" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Usuarios</span>
          </Link>
          <Link 
            href="/categorias" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>Categorías</span>
          </Link>
          <Link 
            href="/solicitudes" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Solicitudes</span>
          </Link>
         </nav>
      </aside>

      {/* Overlay para móvil */}
      {sidebarAbierto && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        {/* Botón para abrir sidebar en móvil */}
        <div className="lg:hidden p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarAbierto(true)}
          >
            ☰ Menú
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
