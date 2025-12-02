'use client';

import { useState, useEffect } from 'react';
import { obtenerCategorias, eliminarCategoria } from '@/app/actions/admin-categorias';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import FormularioCategoria from '@/components/admin/FormularioCategoria';

export default function CategoriasAdminPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setCargando(true);
    const { categorias: data } = await obtenerCategorias();
    setCategorias(data);
    setCargando(false);
  };

  const abrirModalCrear = () => {
    setCategoriaEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (categoria: any) => {
    setCategoriaEditar(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaEditar(null);
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) {
      const resultado = await eliminarCategoria(id);
      if (resultado.success) {
        cargarCategorias();
      } else {
        alert(resultado.error);
      }
    }
  };

  const handleExito = () => {
    cargarCategorias();
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Cargando categorías...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600 mt-2">Administra las categorías de vehículos ({categorias.length})</p>
        </div>
        <button 
          onClick={abrirModalCrear}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No hay categorías registradas</p>
            <p className="text-gray-400 text-sm mt-2">Crea tu primera categoría para comenzar</p>
          </div>
        ) : (
          categorias.map((categoria) => (
            <div 
              key={categoria.id} 
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {categoria.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {categoria.descripcion || 'Sin descripción'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{categoria.vehiculosCount || 0}</span> vehículos
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => abrirModalEditar(categoria)}
                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(categoria.id, categoria.nombre)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Formulario */}
      <FormularioCategoria
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        categoria={categoriaEditar}
        onExito={handleExito}
      />
    </div>
  );
}
