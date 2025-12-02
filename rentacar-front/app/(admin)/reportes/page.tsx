export default function ReportesAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <p className="text-gray-600 mt-2">Visualiza reportes y métricas del negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ingresos Mensuales</h2>
          <p className="text-gray-500 text-center py-8">Gráfico de ingresos próximamente</p>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vehículos Más Rentados</h2>
          <p className="text-gray-500 text-center py-8">Estadísticas próximamente</p>
        </div>
      </div>
    </div>
  );
}
