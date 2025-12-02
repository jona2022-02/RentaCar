# 📚 Documentación del Proyecto RentaCar

Esta carpeta contiene toda la documentación técnica del proyecto.

## 📄 Archivos Disponibles

### API Documentation
- **[API_LOGIN_DOCUMENTATION.md](./API_LOGIN_DOCUMENTATION.md)** - Endpoints de autenticación
  - Login de usuarios
  - Logout
  - Verificación de sesión
  - Ejemplos de uso

- **[API_USUARIOS_CRUD.md](./API_USUARIOS_CRUD.md)** - Endpoints CRUD de usuarios
  - Crear usuarios
  - Listar usuarios
  - Actualizar usuarios
  - Eliminar usuarios
  - Cambiar contraseñas
  - Activar/Desactivar cuentas

### Base de Datos
- **[database/README.md](../database/README.md)** - Documentación de la base de datos
  - Esquema de tablas
  - Relaciones
  - Instrucciones de importación
  - Datos de prueba

## 🚀 Guía Rápida

### Autenticación

```bash
# Login
POST /api/auth/login
{
  "email": "admin@rentacar.com",
  "password": "admin123"
}

# Logout
POST /api/auth/logout

# Verificar sesión
GET /api/auth/verificar
```

### Usuarios (Admin)

```bash
# Listar usuarios
GET /api/usuarios

# Crear usuario
POST /api/usuarios
{
  "email": "nuevo@email.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "CLIENTE"
}

# Actualizar usuario
PUT /api/usuarios/:id
{
  "nombre": "Juan Carlos",
  "telefono": "5551234567"
}

# Cambiar estado
PUT /api/usuarios/:id/estado
{
  "activo": false
}
```

## 🔐 Roles y Permisos

| Endpoint | Admin | Cliente | Público |
|----------|-------|---------|---------|
| Login/Registro | ✅ | ✅ | ✅ |
| Ver vehículos | ✅ | ✅ | ❌ |
| Crear renta | ✅ | ✅ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Gestionar vehículos | ✅ | ❌ | ❌ |
| Aprobar rentas | ✅ | ❌ | ❌ |
| Dashboard admin | ✅ | ❌ | ❌ |

## 📊 Flujo de Trabajo

### 1. Registro y Autenticación
```
Usuario → Registro → Login → Token/Cookie → Acceso
```

### 2. Proceso de Renta
```
Cliente busca vehículo
    ↓
Selecciona fechas
    ↓
Elige método de pago
    ↓
Crea reserva (PENDIENTE)
    ↓
Admin aprueba (CONFIRMADA)
    ↓
Fecha inicio llega (EN_CURSO)
    ↓
Fecha fin llega (COMPLETADA)
```

### 3. Estados de Renta

- **PENDIENTE** - Cliente creó la reserva
- **CONFIRMADA** - Admin aprobó
- **EN_CURSO** - Vehículo en uso
- **COMPLETADA** - Renta finalizada
- **CANCELADA** - Cliente canceló
- **RECHAZADA** - Admin rechazó

## 🛠️ Tecnologías

- **Next.js 16** - Framework full-stack
- **TypeScript** - Tipado estático
- **Prisma ORM** - Base de datos
- **NextAuth.js** - Autenticación
- **MySQL** - Base de datos relacional

## 📞 Soporte

Para más información, consulta el [README principal](../README.md) del proyecto.
