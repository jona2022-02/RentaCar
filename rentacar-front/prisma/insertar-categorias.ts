import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Insertando 5 categorías...');

  const categorias = [
    {
      id: randomUUID(),
      nombre: 'Sedán',
      descripcion: 'Vehículos tipo sedán para uso general',
    },
    {
      id: randomUUID(),
      nombre: 'SUV',
      descripcion: 'Vehículos utilitarios deportivos con mayor capacidad',
    },
    {
      id: randomUUID(),
      nombre: 'Pickup',
      descripcion: 'Camionetas pickup para carga y trabajo',
    },
    {
      id: randomUUID(),
      nombre: 'Deportivo',
      descripcion: 'Vehículos de alto rendimiento y diseño deportivo',
    },
    {
      id: randomUUID(),
      nombre: 'Compacto',
      descripcion: 'Vehículos pequeños y económicos para ciudad',
    },
  ];

  for (const cat of categorias) {
    // Verificar si ya existe (búsqueda simple)
    const existente = await prisma.categoria.findFirst({
      where: {
        nombre: cat.nombre,
      },
    });

    if (existente) {
      console.log(`Categoría "${cat.nombre}" ya existe, saltando...`);
      continue;
    }

    const resultado = await prisma.categoria.create({
      data: cat,
    });

    console.log(`Categoría "${resultado.nombre}" creada con ID: ${resultado.id}`);
  }

  console.log('\nProceso completado');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
