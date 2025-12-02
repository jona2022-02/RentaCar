'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClienteSidebar({ children }: { children: ReactNode }) {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="flex flex-1 relative">
      {/* Sidebar Desktop */}
      <aside 
        style={{ width: sidebarAbierto ? '256px' : '64px' }}
        className="hidden lg:flex flex-col bg-white border-r border-gray-200 text-gray-700 transition-all duration-300 ease-in-out sticky top-0 self-start"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          {sidebarAbierto && (
            <h2 className="text-lg font-bold whitespace-nowrap overflow-hidden">Mi Cuenta</h2>
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
            href="/vehiculos" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Explorar Vehículos</span>}
          </Link>
          <Link 
            href="/mis-rentas" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Mis Rentas</span>}
          </Link>
          <Link 
            href="/perfil" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Mi Perfil</span>}
          </Link>
          <Link 
            href="/historial" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Historial</span>}
          </Link>
          <Link 
            href="/soporte" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition whitespace-nowrap"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {sidebarAbierto && <span className="overflow-hidden text-ellipsis">Soporte</span>}
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
          <h2 className="text-lg font-bold">Mi Cuenta</h2>
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
            href="/vehiculos" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>Explorar Vehículos</span>
          </Link>
          <Link 
            href="/mis-rentas" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Mis Rentas</span>
          </Link>
          <Link 
            href="/perfil" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Mi Perfil</span>
          </Link>
          <Link 
            href="/historial" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Historial</span>
          </Link>
          <Link 
            href="/soporte" 
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 active:bg-blue-50 transition"
            onClick={() => setSidebarAbierto(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Soporte</span>
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
        {children}
      </main>
    </div>
  );
}
