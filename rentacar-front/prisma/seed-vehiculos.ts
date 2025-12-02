import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🚗 Iniciando seed de vehículos...');

  // Primero crear una categoría
  const categoriaId = randomUUID();
  const categoria = await prisma.categoria.create({
    data: {
      id: categoriaId,
      nombre: 'Sedán',
      descripcion: 'Vehículos tipo sedán para uso general',
    },
  });

  console.log('✅ Categoría creada:', categoria.nombre);

  // Crear 10 vehículos
  const vehiculos = [
    {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2024,
      color: 'Blanco',
      placa: 'ABC-1234',
      precioDia: 450,
      precioSemana: 2800,
      precioMes: 10500,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Sedán compacto, económico y confiable',
    },
    {
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2024,
      color: 'Gris',
      placa: 'DEF-5678',
      precioDia: 480,
      precioSemana: 3000,
      precioMes: 11200,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Sedán deportivo con tecnología avanzada',
    },
    {
      marca: 'Nissan',
      modelo: 'Sentra',
      anio: 2023,
      color: 'Negro',
      placa: 'GHI-9012',
      precioDia: 420,
      precioSemana: 2600,
      precioMes: 9800,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Sedán elegante y espacioso',
    },
    {
      marca: 'Mazda',
      modelo: 'Mazda3',
      anio: 2024,
      color: 'Rojo',
      placa: 'JKL-3456',
      precioDia: 500,
      precioSemana: 3100,
      precioMes: 11700,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Diseño premium con excelente manejo',
    },
    {
      marca: 'Volkswagen',
      modelo: 'Jetta',
      anio: 2023,
      color: 'Azul',
      placa: 'MNO-7890',
      precioDia: 460,
      precioSemana: 2850,
      precioMes: 10700,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Sedán alemán con gran calidad',
    },
    {
      marca: 'Hyundai',
      modelo: 'Elantra',
      anio: 2024,
      color: 'Plata',
      placa: 'PQR-2345',
      precioDia: 440,
      precioSemana: 2700,
      precioMes: 10200,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Tecnología y confort en un solo auto',
    },
    {
      marca: 'Kia',
      modelo: 'Forte',
      anio: 2023,
      color: 'Blanco',
      placa: 'STU-6789',
      precioDia: 430,
      precioSemana: 2650,
      precioMes: 10000,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Sedán moderno con gran equipamiento',
    },
    {
      marca: 'Chevrolet',
      modelo: 'Cavalier',
      anio: 2024,
      color: 'Gris',
      placa: 'VWX-0123',
      precioDia: 400,
      precioSemana: 2450,
      precioMes: 9200,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Opción económica y funcional',
    },
    {
      marca: 'Ford',
      modelo: 'Fusion',
      anio: 2023,
      color: 'Negro',
      placa: 'YZA-4567',
      precioDia: 520,
      precioSemana: 3200,
      precioMes: 12000,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Sedán premium con máximo confort',
    },
    {
      marca: 'Renault',
      modelo: 'Fluence',
      anio: 2024,
      color: 'Rojo',
      placa: 'BCD-8901',
      precioDia: 410,
      precioSemana: 2550,
      precioMes: 9600,
      numeroPasajeros: 5,
      numeroPuertas: 4,
      descripcion: 'Estilo francés con gran espacio',
    },
  ];

  for (const vehiculoData of vehiculos) {
    await prisma.vehiculo.create({
      data: {
        id: randomUUID(),
        categoriaId: categoria.id,
        ...vehiculoData,
        tipoCombustible: 'GASOLINA',
        transmision: 'AUTOMATICA',
        tieneAireAcondicionado: true,
        disponible: true,
        kilometraje: 0,
        depositoRequerido: 500,
      },
    });
    console.log(`✅ Vehículo creado: ${vehiculoData.marca} ${vehiculoData.modelo}`);
  }

  console.log('🎉 Seed de vehículos completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
