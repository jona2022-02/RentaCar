import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed de usuarios...');

  // Hashear contraseñas
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientePassword = await bcrypt.hash('cliente123', 10);

  // Limpiar usuarios existentes (opcional)
  await prisma.usuario.deleteMany();
  console.log('🗑️  Usuarios existentes eliminados');

  // Crear usuarios
  const usuarios = await prisma.usuario.createMany({
    data: [
      {
        id: 'admin-1',
        email: 'admin@rentacar.com',
        password: adminPassword,
        nombre: 'Administrador',
        apellido: 'Sistema',
        telefono: '+52 123 456 7890',
        rol: 'ADMIN',
        estado: 'ACTIVO',
      },
      {
        id: 'cliente-1',
        email: 'juan@email.com',
        password: clientePassword,
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+52 987 654 3210',
        rol: 'CLIENTE',
        estado: 'ACTIVO',
      },
      {
        id: 'cliente-2',
        email: 'maria@email.com',
        password: clientePassword,
        nombre: 'María',
        apellido: 'González',
        telefono: '+52 555 123 4567',
        rol: 'CLIENTE',
        estado: 'ACTIVO',
      },
      {
        id: 'cliente-3',
        email: 'carlos@email.com',
        password: clientePassword,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        telefono: '+52 555 987 6543',
        rol: 'CLIENTE',
        estado: 'ACTIVO',
      },
      {
        id: 'cliente-4',
        email: 'ana@email.com',
        password: clientePassword,
        nombre: 'Ana',
        apellido: 'Martínez',
        telefono: '+52 555 246 8135',
        rol: 'CLIENTE',
        estado: 'ACTIVO',
      },
    ],
  });

  console.log(`✅ ${usuarios.count} usuarios creados exitosamente`);
  console.log('\n📋 Usuarios de prueba:');
  console.log('   Admin: admin@rentacar.com / admin123');
  console.log('   Cliente: juan@email.com / cliente123');
  console.log('   Cliente: maria@email.com / cliente123');
  console.log('   Cliente: carlos@email.com / cliente123');
  console.log('   Cliente: ana@email.com / cliente123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
