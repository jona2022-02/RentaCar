import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '@/types';

interface EstadoAuth {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  establecerUsuario: (usuario: Usuario | null) => void;
  cerrarSesion: () => void;
}

export const useAuthStore = create<EstadoAuth>()(
  persist(
    (set) => ({
      usuario: null,
      estaAutenticado: false,
      establecerUsuario: (usuario) => set({ usuario, estaAutenticado: !!usuario }),
      cerrarSesion: () => {
        set({ usuario: null, estaAutenticado: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },
    }),
    {
      name: 'auth-storage', // Nombre de la key en localStorage
    }
  )
);
