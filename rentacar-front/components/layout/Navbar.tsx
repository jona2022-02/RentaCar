'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { logoutAction } from '@/app/actions/auth';

interface NavbarProps {
  usuario?: {
    id: string;
    nombre: string;
    apellido?: string | null;
    email: string;
    rol: string;
  } | null;
}

export default function Navbar({ usuario }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getInitials = (nombre: string, apellido?: string | null) => {
    const n = nombre.charAt(0).toUpperCase();
    const a = apellido?.charAt(0).toUpperCase() || '';
    return n + a;
  };

  return (
    <nav className="border-b border-gray-200/30 bg-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-[#1E293B] to-[#3B82F6] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <span className="text-2xl font-bold text-gray-700">RentaCar</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {!usuario ? (
              <>
                <Link href="/#categorias" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                  Categorías
                </Link>
                <Link href="/#destacados" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                  Destacados
                </Link>
                <Link href="/#como-funciona" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                  Cómo Funciona
                </Link>
                <Link href="/vehiculos" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                  Ver Todos
                </Link>
              </>
            ) : (
              <>
                <Link href="/vehiculos" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                  Vehículos
                </Link>
                {usuario?.rol === 'CLIENTE' && (
                  <>
                    <Link href="/mis-rentas" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                      Mis Rentas
                    </Link>
                  </>
                )}
                {usuario?.rol === 'ADMIN' && (
                  <>
                    <Link href="/dashboard" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                      Dashboard
                    </Link>
                    <Link href="/admin-vehiculos" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                      Administrar
                    </Link>
                    <Link href="/usuarios" className="text-gray-600 hover:text-[#1E293B] transition font-medium">
                      Usuarios
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {usuario ? (
              <div className="flex items-center gap-3">
                {/* Información del usuario (visible en desktop) */}
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{usuario.nombre}</p>
                  <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    {usuario.rol === 'ADMIN' ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Administrador</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Cliente</span>
                      </>
                    )}
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full ring-2 ring-blue-500/50 hover:ring-blue-600 transition-all">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-lg font-bold">
                          {getInitials(usuario.nombre, usuario.apellido)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">{usuario.nombre} {usuario.apellido || ''}</p>
                        <p className="text-xs text-gray-500">{usuario.email}</p>
                        <p className="text-xs font-medium text-blue-600 mt-1 flex items-center gap-1">
                          {usuario.rol === 'ADMIN' ? (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>Administrador</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>Cliente</span>
                            </>
                          )}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    {usuario.rol === 'CLIENTE' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/mis-rentas" className="cursor-pointer flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Mis Rentas
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/favoritos" className="cursor-pointer flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Favoritos
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {usuario.rol === 'ADMIN' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="cursor-pointer flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Dashboard Admin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/vehiculos" className="cursor-pointer flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            Gestión Vehículos
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/rentas" className="cursor-pointer flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Gestión Rentas
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="text-gray-600 hover:text-blue-600">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
