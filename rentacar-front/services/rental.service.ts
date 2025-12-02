import axiosInstance from '@/lib/axios';
import { Renta, FormularioRenta, RespuestaApi, RespuestaPaginada, EstadoRenta } from '@/types';

export const rentaService = {
  // Crear una nueva renta
  async crearRenta(datos: FormularioRenta): Promise<RespuestaApi<Renta>> {
    const response = await axiosInstance.post('/rentas', datos);
    return response.data;
  },

  // Obtener rentas del usuario
  async obtenerMisRentas(): Promise<RespuestaPaginada<Renta>> {
    const response = await axiosInstance.get('/rentas/mis-rentas');
    return response.data;
  },

  // Obtener todas las rentas (Solo Admin)
  async obtenerTodasLasRentas(): Promise<RespuestaPaginada<Renta>> {
    const response = await axiosInstance.get('/rentas');
    return response.data;
  },

  // Obtener renta por ID
  async obtenerRentaPorId(id: string): Promise<RespuestaApi<Renta>> {
    const response = await axiosInstance.get(`/rentas/${id}`);
    return response.data;
  },

  // Cancelar renta
  async cancelarRenta(id: string): Promise<RespuestaApi<Renta>> {
    const response = await axiosInstance.patch(`/rentas/${id}/cancelar`);
    return response.data;
  },

  // Actualizar estado de renta (Solo Admin)
  async actualizarEstadoRenta(id: string, estado: EstadoRenta): Promise<RespuestaApi<Renta>> {
    const response = await axiosInstance.patch(`/rentas/${id}/estado`, { estado });
    return response.data;
  },
};
