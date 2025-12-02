'use client';

import { useState, useEffect } from 'react';
import { obtenerUsuarios, eliminarUsuario, cambiarEstadoUsuario } from '@/app/actions/admin-usuarios';
import { Eye, Pencil, Trash2, Plus, UserCheck, UserX } from 'lucide-react';
import FormularioUsuario from '@/components/admin/FormularioUsuario';

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const { usuarios: data } = await obtenerUsuarios();
    setUsuarios(data);
    setCargando(false);
  };

  const abrirModalCrear = () => {
    setUsuarioEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario: any) => {
    setUsuarioEditar(usuario);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditar(null);
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar al usuario ${nombre}?`)) {
      const resultado = await eliminarUsuario(id);
      if (resultado.success) {
        cargarUsuarios();
      } else {
        alert(resultado.error);
      }
    }
  };

  const handleCambiarEstado = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const resultado = await cambiarEstadoUsuario(id, nuevoEstado);
    if (resultado.success) {
      cargarUsuarios();
    }
  };

  const handleExito = () => {
    cargarUsuarios();
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios registrados en RentaCar ({usuarios.length})</p>
        </div>
        <button 
          onClick={abrirModalCrear}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {usuario.telefono || 'Sin teléfono'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        usuario.rol === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        usuario.estado === 'ACTIVO' 
                          ? 'bg-green-100 text-green-800' 
                          : usuario.estado === 'INACTIVO'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleCambiarEstado(usuario.id, usuario.estado)}
                          className={`${
                            usuario.estado === 'ACTIVO' 
                              ? 'text-orange-600 hover:text-orange-800' 
                              : 'text-green-600 hover:text-green-800'
                          } transition`}
                          title={usuario.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                        >
                          {usuario.estado === 'ACTIVO' ? (
                            <UserX className="w-5 h-5" />
                          ) : (
                            <UserCheck className="w-5 h-5" />
                          )}
                        </button>
                        <button 
                          onClick={() => abrirModalEditar(usuario)}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                          title="Editar"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEliminar(usuario.id, `${usuario.nombre} ${usuario.apellido}`)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Formulario */}
      <FormularioUsuario
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        usuario={usuarioEditar}
        onExito={handleExito}
      />
    </div>
  );
}
