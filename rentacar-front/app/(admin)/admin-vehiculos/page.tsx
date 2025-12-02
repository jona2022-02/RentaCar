'use client';

import { useState, useEffect } from 'react';
import { obtenerVehiculos } from '@/app/actions/vehiculos';
import Link from 'next/link';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import FormularioVehiculo from '@/components/admin/FormularioVehiculo';

export default function AdminVehiculosPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    setCargando(true);
    const { vehiculos: data } = await obtenerVehiculos(false);
    setVehiculos(data);
    setCargando(false);
  };

  const abrirModalCrear = () => {
    setVehiculoEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (vehiculo: any) => {
    setVehiculoEditar(vehiculo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVehiculoEditar(null);
  };

  const handleExito = () => {
    cargarVehiculos();
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Cargando vehículos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
        <p className="mt-2 text-gray-600">
          Administra los vehículos disponibles en el sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Vehículos Registrados ({vehiculos.length})
            </h2>
            <button 
              onClick={abrirModalCrear}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Vehículo</span>
            </button>
          </div>
          
          {vehiculos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No hay vehículos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio/Día
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {vehiculo.marca} {vehiculo.modelo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vehiculo.anio} • {vehiculo.color}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {vehiculo.categoria.nombre}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {vehiculo.placa}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        ${vehiculo.precioDia.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        {vehiculo.disponible ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Disponible
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            No Disponible
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/vehiculos/${vehiculo.id}`}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => abrirModalEditar(vehiculo)}
                            className="text-indigo-600 hover:text-indigo-800 transition"
                            title="Editar"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Formulario */}
      <FormularioVehiculo
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        vehiculo={vehiculoEditar}
        onExito={handleExito}
      />
    </div>
  );
}
