import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el usuario del localStorage no es posible en middleware
  // En Next.js, el middleware corre en el servidor
  // Para autenticación real, necesitarías usar cookies/JWT
  
  // Por ahora, permitimos el acceso y verificaremos en el cliente
  return NextResponse.next();
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/cliente/:path*',
    '/rentas/:path*',
    '/perfil/:path*',
  ],
};
