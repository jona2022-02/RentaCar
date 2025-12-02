import axiosInstance from '@/lib/axios';
import { Vehiculo, FiltrosVehiculo, RespuestaPaginada, RespuestaApi } from '@/types';

export const vehiculoService = {
  // Obtener todos los vehículos con filtros
  async obtenerVehiculos(filtros?: FiltrosVehiculo): Promise<RespuestaPaginada<Vehiculo>> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await axiosInstance.get(`/vehiculos?${params.toString()}`);
    return response.data;
  },

  // Obtener vehículo por ID
  async obtenerVehiculoPorId(id: string): Promise<RespuestaApi<Vehiculo>> {
    const response = await axiosInstance.get(`/vehiculos/${id}`);
    return response.data;
  },

  // Crear vehículo (Solo Admin)
  async crearVehiculo(datos: Partial<Vehiculo>): Promise<RespuestaApi<Vehiculo>> {
    const response = await axiosInstance.post('/vehiculos', datos);
    return response.data;
  },

  // Actualizar vehículo (Solo Admin)
  async actualizarVehiculo(id: string, datos: Partial<Vehiculo>): Promise<RespuestaApi<Vehiculo>> {
    const response = await axiosInstance.put(`/vehiculos/${id}`, datos);
    return response.data;
  },

  // Eliminar vehículo (Solo Admin)
  async eliminarVehiculo(id: string): Promise<RespuestaApi<void>> {
    const response = await axiosInstance.delete(`/vehiculos/${id}`);
    return response.data;
  },
};
