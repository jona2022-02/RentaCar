'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritosPage() {
  const favoritos = [
    {
      id: '1',
      marca: 'Toyota',
      modelo: 'Corolla 2024',
      precioPorDia: 450,
      categoria: 'Sedán',
      disponible: true,
    },
    {
      id: '2',
      marca: 'Ford',
      modelo: 'Explorer 2024',
      precioPorDia: 750,
      categoria: 'SUV',
      disponible: true,
    },
    {
      id: '3',
      marca: 'BMW',
      modelo: 'Serie 3 2023',
      precioPorDia: 1200,
      categoria: 'Sedán',
      disponible: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
        <p className="text-gray-600 mt-2">Vehículos que has guardado como favoritos</p>
      </div>

      {favoritos.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-20 h-20 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes favoritos aún
          </h3>
          <p className="text-gray-600 mb-6">
            Explora nuestro catálogo y guarda tus vehículos preferidos
          </p>
          <Button asChild className="bg-white hover:bg-[#1E293B]">
            <Link href="/vehiculos">Explorar Vehículos</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((vehiculo) => (
            <Card key={vehiculo.id} className="hover:shadow-xl transition-shadow">
              <div className="relative h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="flex justify-center items-center w-full h-full text-[#6B7280]/50">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <Badge className={`absolute top-4 right-4 ${vehiculo.disponible ? 'bg-green-500' : 'bg-gray-500'} text-gray-900`}>
                  {vehiculo.disponible ? 'Disponible' : 'No disponible'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 left-4 bg-[#1E293B]/80 hover:bg-[#1E293B]"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {vehiculo.marca} {vehiculo.modelo}
                  </h3>
                  <p className="text-sm text-[#6B7280]/70">{vehiculo.categoria}</p>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-[#FFFFFF]">
                    ${vehiculo.precioPorDia}
                  </div>
                  <div className="text-xs text-[#6B7280]/70">por día</div>
                </div>
                <Button className="w-full bg-[#1E293B] hover:bg-[#1E293B]" asChild>
                  <Link href={`/vehiculos/${vehiculo.id}`}>Ver Detalles</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
