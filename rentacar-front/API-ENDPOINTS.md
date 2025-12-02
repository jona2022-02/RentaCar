# RentaCar - Documentación de API Endpoints

## Base URL
```
http://localhost:3000
```

## Autenticación

### POST /api/auth/login
Inicia sesión de usuario.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "usuario": {
    "id": "string",
    "email": "string",
    "nombre": "string",
    "rol": "ADMIN | CLIENTE"
  }
}
```

### POST /api/auth/registro
Registra un nuevo usuario.

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "nombre": "string",
  "apellido": "string (opcional)",
  "telefono": "string (opcional)",
  "direccion": "string (opcional)",
  "ciudad": "string (opcional)",
  "pais": "string (opcional)",
  "fechaNacimiento": "string (ISO date, opcional)",
  "numeroLicencia": "string (opcional)"
}
```

**Response:**
```json
{
  "success": true,
  "usuario": {
    "id": "string",
    "email": "string",
    "nombre": "string",
    "rol": "CLIENTE"
  }
}
```

---

## Vehículos

### GET /api/vehiculos
Obtiene lista de vehículos.

**Query Parameters:**
- `soloDisponibles` (boolean, opcional): Si es `true`, solo retorna vehículos con `disponible: true`

**Response:**
```json
{
  "success": true,
  "vehiculos": [
    {
      "id": "string",
      "marca": "string",
      "modelo": "string",
      "anio": "number",
      "color": "string | null",
      "placa": "string",
      "numeroMotor": "string | null",
      "numeroChasis": "string | null",
      "kilometraje": "number",
      "tipoCombustible": "GASOLINA | DIESEL | ELECTRICO | HIBRIDO",
      "transmision": "MANUAL | AUTOMATICA",
      "numeroPasajeros": "number",
      "numeroPuertas": "number",
      "tieneAireAcondicionado": "boolean",
      "descripcion": "string | null",
      "precioDia": "number",
      "precioSemana": "number | null",
      "precioMes": "number | null",
      "depositoRequerido": "number",
      "imagenes": "any",
      "disponible": "boolean",
      "categoriaId": "string",
      "categoria": {
        "id": "string",
        "nombre": "string",
        "descripcion": "string | null"
      },
      "creadoEn": "string (ISO date)",
      "actualizadoEn": "string (ISO date)"
    }
  ]
}
```

### GET /api/vehiculos/:id
Obtiene un vehículo por ID.

**Response:**
```json
{
  "success": true,
  "vehiculo": {
    // Mismo objeto que en la lista
  }
}
```

---

## Admin - Vehículos

### POST /api/admin/vehiculos
Crea un nuevo vehículo.

**Body:**
```json
{
  "marca": "string",
  "modelo": "string",
  "anio": "number",
  "color": "string",
  "placa": "string",
  "numeroMotor": "string (opcional)",
  "numeroChasis": "string (opcional)",
  "kilometraje": "number",
  "tipoCombustible": "GASOLINA | DIESEL | ELECTRICO | HIBRIDO",
  "transmision": "MANUAL | AUTOMATICA",
  "numeroPasajeros": "number",
  "numeroPuertas": "number",
  "tieneAireAcondicionado": "boolean",
  "descripcion": "string (opcional)",
  "precioDia": "number",
  "precioSemana": "number (opcional)",
  "precioMes": "number (opcional)",
  "depositoRequerido": "number",
  "imagenes": "any (opcional)",
  "disponible": "boolean",
  "categoriaId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "vehiculo": {
    // Objeto del vehículo creado
  }
}
```

### PUT /api/admin/vehiculos/:id
Actualiza un vehículo existente.

**Body:**
```json
{
  // Mismos campos que POST, todos opcionales
}
```

**Response:**
```json
{
  "success": true,
  "vehiculo": {
    // Objeto del vehículo actualizado
  }
}
```

### DELETE /api/admin/vehiculos/:id
Elimina un vehículo.

**Response:**
```json
{
  "success": true
}
```

### PATCH /api/admin/vehiculos/:id/disponibilidad
Cambia la disponibilidad de un vehículo.

**Body:**
```json
{
  "disponible": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "vehiculo": {
    // Objeto del vehículo actualizado
  }
}
```

### GET /api/admin/categorias
Obtiene todas las categorías.

**Response:**
```json
{
  "success": true,
  "categorias": [
    {
      "id": "string",
      "nombre": "string",
      "descripcion": "string | null",
      "creadoEn": "string (ISO date)",
      "actualizadoEn": "string (ISO date)"
    }
  ]
}
```

---

## Notas Importantes

### Server Actions vs REST API
Esta aplicación utiliza **Next.js Server Actions** en lugar de endpoints REST tradicionales. Los Server Actions son funciones del servidor que se pueden llamar directamente desde componentes del cliente.

**Para consumir desde otra aplicación:**
Necesitarás crear endpoints REST tradicionales que envuelvan estos Server Actions. Los Server Actions actuales están en:
- `/app/actions/auth.ts`
- `/app/actions/vehiculos.ts`
- `/app/actions/admin-vehiculos.ts`

### Conversión de Datos
- Los campos `Decimal` de Prisma se convierten a `Number` en las respuestas
- Las fechas se serializan como strings ISO 8601
- Los enums se retornan como strings

### Autenticación
Actualmente la autenticación se maneja con cookies de sesión. Para uso en otra aplicación, considera implementar JWT o API Keys.

---

## Ejemplos de Uso

### JavaScript/TypeScript
```typescript
// Obtener vehículos disponibles
const response = await fetch('http://localhost:3000/api/vehiculos?soloDisponibles=true');
const data = await response.json();
console.log(data.vehiculos);

// Crear vehículo (admin)
const response = await fetch('http://localhost:3000/api/admin/vehiculos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2024,
    placa: 'ABC-1234',
    // ... resto de campos
  })
});
```

### cURL
```bash
# Obtener vehículos
curl http://localhost:3000/api/vehiculos

# Crear vehículo
curl -X POST http://localhost:3000/api/admin/vehiculos \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Toyota",
    "modelo": "Corolla",
    "anio": 2024,
    "placa": "ABC-1234"
  }'
```

---

**Última actualización:** Diciembre 1, 2025
