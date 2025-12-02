import axiosInstance from '@/lib/axios';
import { FormularioLogin, FormularioRegistro, Usuario, RespuestaApi } from '@/types';

export const authService = {
  // Login
  async login(credenciales: FormularioLogin): Promise<RespuestaApi<{ usuario: Usuario; token: string }>> {
    const response = await axiosInstance.post('/auth/login', credenciales);
    if (response.data.exito && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.datos.token);
    }
    return response.data;
  },

  // Registro
  async register(datosUsuario: FormularioRegistro): Promise<RespuestaApi<{ usuario: Usuario; token: string }>> {
    const response = await axiosInstance.post('/auth/register', datosUsuario);
    if (response.data.exito && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.datos.token);
    }
    return response.data;
  },

  // Cerrar sesión
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  },

  // Obtener usuario actual
  async obtenerUsuarioActual(): Promise<RespuestaApi<Usuario>> {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};
