# API de Autenticación - RentaCar

## Endpoint de Login

### POST `/api/auth/login`

Autentica a un usuario en el sistema y establece una cookie de sesión.

**Formato de Respuesta:** JSON

---

## Request

### URL
```
POST http://tu-dominio.com/api/auth/login
```

### Headers
```
Content-Type: application/json
```

**Headers de Respuesta:**
```
Content-Type: application/json
Set-Cookie: auth-token=<jwt-token>; HttpOnly; Path=/; Max-Age=604800
```

### Body (JSON)
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Campos requeridos:**
- `email` (string): Email del usuario registrado
- `password` (string): Contraseña del usuario

---

## Response

### Respuesta Exitosa (200 OK)

```json
{
  "usuario": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "CLIENTE",
    "estado": "ACTIVO",
    "telefono": "+503 1234-5678",
    "direccion": "Calle Principal #123",
    "ciudad": "San Salvador",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "mensaje": "Inicio de sesión exitoso"
}
```

**Cookies establecidas:**
- `auth-token`: Token JWT httpOnly (válido por 7 días)

---

### Errores Comunes

#### 401 Unauthorized - Credenciales inválidas
```json
{
  "error": "Credenciales inválidas"
}
```

#### 404 Not Found - Usuario no encontrado
```json
{
  "error": "Usuario no encontrado"
}
```

#### 403 Forbidden - Usuario inactivo
```json
{
  "error": "Usuario inactivo. Contacte al administrador"
}
```

#### 400 Bad Request - Datos faltantes
```json
{
  "error": "Email y contraseña son requeridos"
}
```

---

## Roles de Usuario

- `ADMIN`: Administrador del sistema
- `CLIENTE`: Usuario cliente

---

## Estados de Usuario

- `ACTIVO`: Usuario puede iniciar sesión
- `INACTIVO`: Usuario bloqueado

---

## Consumo desde Otro Sistema

### Ejemplo con JavaScript (Fetch)

```javascript
async function login(email, password) {
  try {
    const response = await fetch('http://tu-dominio.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANTE: para recibir y enviar cookies
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en el login');
    }

    const data = await response.json();
    console.log('Login exitoso:', data.usuario);
    return data.usuario;
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Uso
login('usuario@ejemplo.com', 'contraseña123')
  .then(usuario => console.log('Bienvenido:', usuario.nombre))
  .catch(err => console.error('Falló el login:', err));
```

---

### Ejemplo con Axios

```javascript
import axios from 'axios';

async function login(email, password) {
  try {
    const response = await axios.post(
      'http://tu-dominio.com/api/auth/login',
      {
        email: email,
        password: password
      },
      {
        withCredentials: true // IMPORTANTE: para recibir y enviar cookies
      }
    );

    console.log('Login exitoso:', response.data.usuario);
    return response.data.usuario;
    
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error del servidor:', error.response.data.error);
      throw new Error(error.response.data.error);
    } else if (error.request) {
      // No se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      throw new Error('Error de conexión');
    } else {
      console.error('Error:', error.message);
      throw error;
    }
  }
}

// Uso
login('usuario@ejemplo.com', 'contraseña123')
  .then(usuario => console.log('Bienvenido:', usuario.nombre))
  .catch(err => console.error('Falló el login:', err));
```

---

### Ejemplo con Python (requests)

```python
import requests

def login(email, password):
    url = 'http://tu-dominio.com/api/auth/login'
    headers = {'Content-Type': 'application/json'}
    data = {
        'email': email,
        'password': password
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        print(f"Login exitoso: {result['usuario']['nombre']}")
        
        # Las cookies se guardan automáticamente en la sesión
        return result['usuario'], response.cookies
        
    except requests.exceptions.HTTPError as err:
        error_msg = err.response.json().get('error', 'Error desconocido')
        print(f"Error: {error_msg}")
        raise
    except Exception as err:
        print(f"Error de conexión: {err}")
        raise

# Uso
usuario, cookies = login('usuario@ejemplo.com', 'contraseña123')
print(f"Bienvenido: {usuario['nombre']}")
```

---

### Ejemplo con cURL

```bash
curl -X POST http://tu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }' \
  -c cookies.txt
```

**Nota:** `-c cookies.txt` guarda las cookies en un archivo para usarlas en peticiones posteriores.

---

## Peticiones Autenticadas

Después del login, todas las peticiones subsecuentes deben incluir las cookies de autenticación.

### Ejemplo con Fetch

```javascript
async function obtenerPerfil() {
  const response = await fetch('http://tu-dominio.com/api/perfil', {
    method: 'GET',
    credentials: 'include' // Incluye las cookies automáticamente
  });
  
  const data = await response.json();
  return data;
}
```

### Ejemplo con Axios

```javascript
// Configurar axios globalmente
axios.defaults.withCredentials = true;

async function obtenerPerfil() {
  const response = await axios.get('http://tu-dominio.com/api/perfil');
  return response.data;
}
```

---

## Consideraciones de Seguridad

1. **HTTPS obligatorio en producción**: Las cookies httpOnly solo funcionan correctamente con HTTPS.

2. **CORS**: Asegúrate de que tu servidor permita peticiones del dominio desde donde consumes la API:
   ```javascript
   Access-Control-Allow-Origin: http://tu-dominio-frontend.com
   Access-Control-Allow-Credentials: true
   ```

3. **Cookie httpOnly**: El token se almacena en una cookie httpOnly que no es accesible desde JavaScript del cliente (previene XSS).

4. **Duración del token**: 7 días. Después expira y el usuario debe volver a iniciar sesión.

5. **No guardar la contraseña**: Nunca almacenes la contraseña en el cliente.

---

## Logout

### POST `/api/auth/logout`

Cierra la sesión del usuario eliminando la cookie de autenticación.

```javascript
async function logout() {
  const response = await fetch('http://tu-dominio.com/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  
  const data = await response.json();
  console.log(data.mensaje); // "Sesión cerrada exitosamente"
}
```

---

## Verificar Sesión Activa

### GET `/api/auth/verificar`

Verifica si existe una sesión activa válida.

```javascript
async function verificarSesion() {
  try {
    const response = await fetch('http://tu-dominio.com/api/auth/verificar', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.usuario; // Usuario autenticado
    } else {
      return null; // No hay sesión activa
    }
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return null;
  }
}
```

---

## Contacto y Soporte

**Email:** soporte@rentacar.com  
**Teléfono:** +503 2222-2222

---

## Notas Adicionales

- Todos los endpoints requieren que la base de datos esté activa y accesible
- Los tiempos de respuesta típicos son < 200ms
- Se recomienda implementar retry logic para peticiones fallidas
- El sistema usa MySQL en AlwaysData como base de datos
