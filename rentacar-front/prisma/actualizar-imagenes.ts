import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs de imágenes de ejemplo de coches desde Imgur
const imagenesVehiculos = [
  'https://i.imgur.com/HIupscd.jpeg', // Toyota Corolla blanco
  'https://i.imgur.com/8xJzKqm.jpeg', // Honda Civic gris
  'https://i.imgur.com/mN5pZLc.jpeg', // Nissan Sentra negro
  'https://i.imgur.com/Kw7gJHN.jpeg', // Mazda3 rojo
  'https://i.imgur.com/9sX3kPL.jpeg', // VW Jetta azul
  'https://i.imgur.com/7Hp2wYx.jpeg', // Hyundai Elantra plata
  'https://i.imgur.com/HIupscd.jpeg', // Kia Forte blanco
  'https://i.imgur.com/8xJzKqm.jpeg', // Chevrolet Cavalier gris
  'https://i.imgur.com/mN5pZLc.jpeg', // Ford Fusion negro
  'https://i.imgur.com/Kw7gJHN.jpeg', // Renault Fluence rojo
];

async function main() {
  console.log('🖼️  Actualizando imágenes de vehículos...');

  // Obtener todos los vehículos
  const vehiculos = await prisma.vehiculo.findMany({
    orderBy: { creadoEn: 'asc' }
  });

  console.log(`📋 Encontrados ${vehiculos.length} vehículos`);

  // Actualizar cada vehículo con una imagen
  for (let i = 0; i < vehiculos.length; i++) {
    const vehiculo = vehiculos[i];
    const imagenUrl = imagenesVehiculos[i % imagenesVehiculos.length];

    await prisma.vehiculo.update({
      where: { id: vehiculo.id },
      data: {
        imagenes: { url: imagenUrl }
      }
    });

    console.log(`✅ Actualizado: ${vehiculo.marca} ${vehiculo.modelo} -> ${imagenUrl}`);
  }

  console.log('🎉 Todas las imágenes actualizadas exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
