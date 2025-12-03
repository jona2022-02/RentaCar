#  RentaCar - Sistema de Renta de Vehículos

Sistema completo de gestión de renta de vehículos desarrollado con **Next.js 16**, **Prisma ORM**, **MySQL** y **TypeScript**.

##  Descripción

RentaCar es una plataforma moderna para la gestión integral de renta de vehículos que incluye:

-  Sistema de autenticación con roles (Admin/Cliente)
-  Catálogo de vehículos con imágenes y filtros
-  Sistema de reservaciones con validación de disponibilidad
-  Métodos de pago (Efectivo/Tarjeta)
-  Generación automática de contratos PDF
-  Dashboard administrativo con estadísticas
- 📱 Diseño responsive y UI/UX moderna

##  Tecnologías Utilizadas

### Frontend
- **Next.js 16.0.3** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI profesionales
- **Zustand** - Gestión de estado global
- **SweetAlert2** - Alertas elegantes

### Backend
- **Next.js API Routes** - Endpoints REST
- **Prisma ORM 5.22** - ORM para MySQL
- **NextAuth.js** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **jsPDF** - Generación de PDFs

### Base de Datos
- **MySQL 8.0+** - Base de datos relacional
- **AlwaysData** - Hosting de base de datos (producción)

##  Estructura del Proyecto

```
RentaCar/
├── rentacar-front/          # Aplicación Next.js
│   ├── app/                 # App Router de Next.js
│   │   ├── (admin)/        # Rutas administrativas
│   │   ├── (auth)/         # Rutas de autenticación
│   │   ├── (cliente)/      # Rutas de cliente
│   │   ├── api/            # API Routes
│   │   └── actions/        # Server Actions
│   ├── components/         # Componentes React
│   │   ├── layout/        # Layouts (Navbar, Footer, Sidebars)
│   │   ├── admin/         # Componentes admin
│   │   ├── vehiculos/     # Componentes de vehículos
│   │   └── ui/            # Componentes shadcn/ui
│   ├── lib/               # Utilidades y configuración
│   ├── prisma/            # Schema y migraciones
│   ├── services/          # Servicios de API
│   ├── store/             # Store de Zustand
│   └── types/             # Tipos TypeScript
├── database/              # Scripts SQL
│   ├── schema.sql        # Esquema de base de datos
│   ├── seed.sql          # Datos de prueba
│   └── README.md         # Documentación de BD
└── docs/                 # Documentación API
```

##  Instalación y Configuración

### Requisitos Previos
- Node.js 18+ y npm
- MySQL 8.0+
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jona2022-02/RentaCar.git
cd RentaCar
```

### 2. Configurar Base de Datos

1. Crear base de datos MySQL:
```sql
CREATE DATABASE rentacar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importar esquema:
```bash
mysql -u tu_usuario -p rentacar_db < database/schema.sql
```

3. (Opcional) Importar datos de prueba:
```bash
mysql -u tu_usuario -p rentacar_db < database/seed.sql
```

### 3. Configurar Frontend

```bash
cd rentacar-front
npm install
```

### 4. Variables de Entorno

Crear archivo `.env` en `rentacar-front/`:

```env
# Base de datos
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/rentacar_db"

# NextAuth (generar con: openssl rand -base64 32)
NEXTAUTH_SECRET="tu_secret_key_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (opcional, para imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="tu_preset"
```

### 5. Generar Cliente Prisma

```bash
cd rentacar-front
npx prisma generate
```

### 6. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

##  Documentación API

Consulta la documentación detallada de los endpoints en:

- [Autenticación API](./API_LOGIN_DOCUMENTATION.md)
- [CRUD de Usuarios](./API_USUARIOS_CRUD.md)
- [Documentación de Base de Datos](./database/README.md)

##  Características Principales

### Para Clientes
- ✅ Registro y login seguro
- ✅ Explorar catálogo de vehículos
- ✅ Filtrar por categoría, precio, disponibilidad
- ✅ Reservar vehículos con fechas específicas
- ✅ Elegir método de pago (Efectivo/Tarjeta)
- ✅ Ver historial de rentas
- ✅ Descargar contratos PDF
- ✅ Cancelar reservaciones pendientes
- ✅ Gestionar perfil de usuario

### Para Administradores
- ✅ Dashboard con estadísticas en tiempo real
- ✅ CRUD completo de vehículos
- ✅ CRUD completo de usuarios
- ✅ CRUD completo de categorías
- ✅ Gestión de solicitudes de renta
- ✅ Aprobar/Rechazar reservaciones
- ✅ Ver reportes y métricas
- ✅ Activar/Desactivar usuarios

##  Roles y Permisos

### Administrador
- Acceso completo al dashboard
- Gestión de vehículos, usuarios y categorías
- Aprobación de rentas
- Visualización de reportes

### Cliente
- Explorar vehículos disponibles
- Crear reservaciones
- Gestionar sus propias rentas
- Actualizar perfil

## 🗄️ Modelo de Base de Datos

### Tablas Principales

- **Usuario** - Usuarios del sistema (admin/cliente)
- **Categoria** - Categorías de vehículos (Sedán, SUV, etc.)
- **Vehiculo** - Catálogo de vehículos
- **Renta** - Reservaciones de vehículos
- **Pago** - Registros de pagos

### Estados de Renta

- `PENDIENTE` - Creada por el cliente, esperando aprobación
- `CONFIRMADA` - Aprobada por el administrador
- `EN_CURSO` - Vehículo en uso (dentro del periodo de renta)
- `COMPLETADA` - Renta finalizada exitosamente
- `CANCELADA` - Cancelada por el cliente
- `RECHAZADA` - Rechazada por el administrador

##  UI/UX

El diseño utiliza una paleta de colores elegante:
- **Stone/Beige** - Tonos principales suaves y profesionales
- **Amber** - Acentos cálidos
- **Gray** - Textos y elementos secundarios

Componentes UI de **shadcn/ui** para una experiencia moderna y consistente.

##  Responsive Design

La aplicación está completamente optimizada para:
-  Móviles (320px+)
-  Tablets (768px+)
-  Laptops (1024px+)
- 🖥️ Desktops (1280px+)

##  Seguridad

-  Autenticación con NextAuth.js
-  Contraseñas encriptadas con bcrypt
-  Protección de rutas por rol
-  Validación de datos en servidor
-  Prevención de SQL injection (Prisma)
-  Variables de entorno para datos sensibles

