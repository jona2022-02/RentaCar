# API CRUD de Usuarios - RentaCar

## Endpoints de Usuarios

Todos los endpoints retornan **JSON** y requieren autenticación (excepto login).

---

## 1. Crear Usuario (Registro)

### POST `/api/usuarios`

Crea un nuevo usuario en el sistema (registro público).

**URL completa:**
```
POST http://localhost:3000/api/usuarios
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+503 1234-5678",
  "direccion": "Calle Principal #123",
  "ciudad": "San Salvador",
  "rol": "CLIENTE"
}
```

**Campos:**
- `email` (string, requerido): Email único del usuario
- `password` (string, requerido): Contraseña (mínimo 6 caracteres)
- `nombre` (string, requerido): Nombre del usuario
- `apellido` (string, opcional): Apellido del usuario
- `telefono` (string, opcional): Teléfono de contacto
- `direccion` (string, opcional): Dirección física
- `ciudad` (string, opcional): Ciudad de residencia
- `rol` (string, opcional): `ADMIN` o `CLIENTE` (default: `CLIENTE`)

**Respuesta exitosa (201):**
```json
{
  "usuario": {
    "id": "uuid-generado",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+503 1234-5678",
    "direccion": "Calle Principal #123",
    "ciudad": "San Salvador",
    "rol": "CLIENTE",
    "estado": "ACTIVO"
  },
  "mensaje": "Usuario creado exitosamente"
}
```

**Errores:**
- `400`: Email ya registrado
- `400`: Datos faltantes o inválidos

---

## 2. Obtener Todos los Usuarios

### GET `/api/usuarios`

Lista todos los usuarios del sistema (solo ADMIN).

**URL completa:**
```
GET http://localhost:3000/api/usuarios
```

**Headers:**
```
Cookie: usuario_id=<id-sesion>
```

**Query Parameters (opcionales):**
```
?rol=CLIENTE          # Filtrar por rol
&estado=ACTIVO        # Filtrar por estado
&page=1               # Página (default: 1)
&limit=10             # Items por página (default: 10)
```

**Respuesta exitosa (200):**
```json
{
  "usuarios": [
    {
      "id": "uuid-1",
      "email": "usuario1@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "telefono": "+503 1234-5678",
      "direccion": "Calle Principal #123",
      "ciudad": "San Salvador",
      "rol": "CLIENTE",
      "estado": "ACTIVO"
    },
    {
      "id": "uuid-2",
      "email": "admin@ejemplo.com",
      "nombre": "María",
      "apellido": "García",
      "telefono": "+503 9876-5432",
      "direccion": "Avenida Central #456",
      "ciudad": "Santa Ana",
      "rol": "ADMIN",
      "estado": "ACTIVO"
    }
  ],
  "total": 25,
  "pagina": 1,
  "totalPaginas": 3
}
```

**Errores:**
## 3. Obtener Usuario por ID

### GET `/api/usuarios/[id]`

Obtiene los datos de un usuario específico.

**URL completa:**
```
GET http://localhost:3000/api/usuarios/550e8400-e29b-41d4-a716-446655440000
```

**Headers:**
### GET `/api/usuarios/:id`

Obtiene los datos de un usuario específico.

**Parámetros URL:**
- `[id]` - UUID del usuario

**Ejemplo:**
```
GET http://localhost:3000/api/usuarios/550e8400-e29b-41d4-a716-446655440000
```:id` - UUID del usuario

**Ejemplo:**
```
GET /api/usuarios/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta exitosa (200):**
```json
{
  "usuario": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+503 1234-5678",
    "direccion": "Calle Principal #123",
    "ciudad": "San Salvador",
    "rol": "CLIENTE",
    "estado": "ACTIVO"
  }
}
```

**Errores:**
## 4. Actualizar Usuario

### PUT `/api/usuarios/[id]`

Actualiza los datos de un usuario existente.

**URL completa:**
```
PUT http://localhost:3000/api/usuarios/550e8400-e29b-41d4-a716-446655440000
```

**Headers:**
**Parámetros URL:**
- `[id]` - UUID del usuario a actualizar
Actualiza los datos de un usuario existente.

**Headers:**
```
Content-Type: application/json
Cookie: usuario_id=<id-sesion>
```

**Parámetros URL:**
- `:id` - UUID del usuario a actualizar

**Body (todos los campos son opcionales):**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez López",
  "telefono": "+503 2222-3333",
  "direccion": "Nueva Dirección #789",
  "ciudad": "San Miguel",
  "estado": "ACTIVO",
  "rol": "ADMIN"
}
```

**Nota:** Solo ADMIN puede cambiar `rol` y `estado` de otros usuarios.

**Respuesta exitosa (200):**
```json
{
  "usuario": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan Carlos",
    "apellido": "Pérez López",
    "telefono": "+503 2222-3333",
    "direccion": "Nueva Dirección #789",
    "ciudad": "San Miguel",
    "rol": "ADMIN",
    "estado": "ACTIVO"
  },
  "mensaje": "Usuario actualizado exitosamente"
}
```

**Errores:**
- `401`: No autenticado
## 5. Eliminar Usuario

### DELETE `/api/usuarios/[id]`

Elimina un usuario del sistema (solo ADMIN).

**URL completa:**
```
DELETE http://localhost:3000/api/usuarios/550e8400-e29b-41d4-a716-446655440000
```

**Parámetros URL:**
- `[id]` - UUID del usuario a eliminar

Elimina un usuario del sistema (solo ADMIN).

**Headers:**
```
Cookie: usuario_id=<id-sesion>
```

**Parámetros URL:**
- `:id` - UUID del usuario a eliminar

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Usuario eliminado exitosamente"
## 6. Cambiar Contraseña

### PUT `/api/usuarios/[id]/password`

Cambia la contraseña de un usuario.

**URL completa:**
```
PUT http://localhost:3000/api/usuarios/550e8400-e29b-41d4-a716-446655440000/password
```

**Headers:**ario no encontrado

---

## 6. Cambiar Contraseña

### PUT `/api/usuarios/:id/password`

Cambia la contraseña de un usuario.

**Headers:**
```
Content-Type: application/json
Cookie: usuario_id=<id-sesion>
```

**Parámetros URL:**
- `:id` - UUID del usuario

**Body:**
```json
{
  "passwordActual": "contraseñaVieja123",
  "passwordNueva": "contraseñaNueva456"
}
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Contraseña actualizada exitosamente"
## 7. Activar/Desactivar Usuario

### PUT `/api/usuarios/[id]/estado`

Cambia el estado de un usuario (solo ADMIN).

**URL completa:**
```
PUT http://localhost:3000/api/usuarios/550e8400-e29b-41d4-a716-446655440000/estado
```

**Headers:**va contraseña muy corta

---

## 7. Activar/Desactivar Usuario

### PUT `/api/usuarios/:id/estado`

Cambia el estado de un usuario (solo ADMIN).

**Headers:**
```
Content-Type: application/json
Cookie: usuario_id=<id-sesion>
```

**Parámetros URL:**
- `:id` - UUID del usuario

**Body:**
```json
{
  "estado": "INACTIVO"
}
```

**Valores permitidos:**
- `ACTIVO`: Usuario puede iniciar sesión
- `INACTIVO`: Usuario bloqueado

**Respuesta exitosa (200):**
```json
{
  "usuario": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "estado": "INACTIVO"
  },
  "mensaje": "Estado actualizado exitosamente"
}
```

**Errores:**
- `401`: No autenticado
- `403`: Solo administradores
- `404`: Usuario no encontrado

---

## Ejemplos de Consumo

### Crear Usuario (JavaScript)

```javascript
async function crearUsuario(datos) {
  const response = await fetch('http://localhost:3000/api/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Uso
crearUsuario({
  email: 'nuevo@ejemplo.com',
  password: 'segura123',
  nombre: 'Pedro',
  apellido: 'Martínez',
  telefono: '+503 5555-6666',
  ciudad: 'San Salvador'
}).then(data => console.log('Usuario creado:', data));
```

---

### Obtener Todos los Usuarios (JavaScript)

```javascript
async function obtenerUsuarios(filtros = {}) {
  const params = new URLSearchParams(filtros);
  
  const response = await fetch(`http://localhost:3000/api/usuarios?${params}`, {
    method: 'GET',
    credentials: 'include' // Incluye cookies
  });

  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }

  return await response.json();
}

// Uso
obtenerUsuarios({ rol: 'CLIENTE', page: 1, limit: 20 })
  .then(data => console.log('Usuarios:', data.usuarios));
```

---

### Actualizar Usuario (JavaScript)

```javascript
async function actualizarUsuario(id, datos) {
  const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Uso
actualizarUsuario('550e8400-e29b-41d4-a716-446655440000', {
  nombre: 'Juan Carlos',
  telefono: '+503 9999-8888'
}).then(data => console.log('Usuario actualizado:', data));
```

---

### Eliminar Usuario (JavaScript)

```javascript
async function eliminarUsuario(id) {
  const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Uso
eliminarUsuario('550e8400-e29b-41d4-a716-446655440000')
  .then(data => console.log(data.mensaje));
```

---

### Ejemplo con Python

```python
import requests

BASE_URL = 'http://localhost:3000/api'

# Crear usuario
def crear_usuario(datos):
    response = requests.post(
        f'{BASE_URL}/usuarios',
        json=datos
    )
    response.raise_for_status()
    return response.json()

# Obtener usuarios
def obtener_usuarios(session, filtros=None):
    response = session.get(
        f'{BASE_URL}/usuarios',
        params=filtros
    )
    response.raise_for_status()
    return response.json()

# Actualizar usuario
def actualizar_usuario(session, user_id, datos):
    response = session.put(
        f'{BASE_URL}/usuarios/{user_id}',
        json=datos
    )
    response.raise_for_status()
    return response.json()

# Eliminar usuario
def eliminar_usuario(session, user_id):
    response = session.delete(f'{BASE_URL}/usuarios/{user_id}')
    response.raise_for_status()
    return response.json()

# Uso
session = requests.Session()
# Primero hacer login para obtener cookies...
usuarios = obtener_usuarios(session, {'rol': 'CLIENTE'})
print(f"Total usuarios: {usuarios['total']}")
```

---

### Ejemplo con cURL

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@ejemplo.com",
    "password": "segura123",
    "nombre": "Pedro",
    "apellido": "Martínez"
  }'

# Obtener usuarios (requiere login previo)
curl -X GET http://localhost:3000/api/usuarios \
  -b cookies.txt

# Actualizar usuario
curl -X PUT http://localhost:3000/api/usuarios/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
| Método | Endpoint | Descripción | Auth | Admin |
|--------|----------|-------------|------|-------|
| `POST` | `/api/usuarios` | Crear usuario | No | No |
| `GET` | `/api/usuarios` | Listar usuarios | Sí | Sí |
| `GET` | `/api/usuarios/[id]` | Obtener usuario | Sí | No* |
| `PUT` | `/api/usuarios/[id]` | Actualizar usuario | Sí | No* |
| `DELETE` | `/api/usuarios/[id]` | Eliminar usuario | Sí | Sí |
| `PUT` | `/api/usuarios/[id]/password` | Cambiar contraseña | Sí | No* |
| `PUT` | `/api/usuarios/[id]/estado` | Cambiar estado | Sí | Sí |
```

---

## Resumen de Endpoints

| Método | Endpoint | Descripción | Auth | Admin |
|--------|----------|-------------|------|-------|
| `POST` | `/api/usuarios` | Crear usuario | No | No |
| `GET` | `/api/usuarios` | Listar usuarios | Sí | Sí |
| `GET` | `/api/usuarios/:id` | Obtener usuario | Sí | No* |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario | Sí | No* |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario | Sí | Sí |
| `PUT` | `/api/usuarios/:id/password` | Cambiar contraseña | Sí | No* |
| `PUT` | `/api/usuarios/:id/estado` | Cambiar estado | Sí | Sí |

**\*Nota:** Usuarios pueden ver/editar su propio perfil. Solo ADMIN puede ver/editar otros usuarios.

---

## Roles y Permisos

### CLIENTE
- Puede crear su propia cuenta
- Puede ver su propio perfil
- Puede actualizar sus propios datos
- Puede cambiar su propia contraseña
- **NO puede** ver otros usuarios
- **NO puede** cambiar roles o estados

### ADMIN
- Todos los permisos de CLIENTE
- Puede ver todos los usuarios
- Puede actualizar cualquier usuario
- Puede eliminar usuarios
- Puede cambiar roles y estados
- Puede activar/desactivar usuarios

---

## Notas de Seguridad

1. Las contraseñas se almacenan encriptadas con bcrypt
2. El email debe ser único en el sistema
3. Los tokens de sesión expiran en 7 días
4. Solo ADMIN puede cambiar el rol de un usuario
5. No se puede eliminar el propio usuario si está autenticado
6. Las contraseñas deben tener mínimo 6 caracteres

---

## Contacto

**Email:** soporte@rentacar.com  
**Teléfono:** +503 2222-2222
