# Configuración de Cloudinary para RentaCar

## Paso 1: Crear cuenta en Cloudinary

1. Ve a [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Regístrate con tu email
3. Verifica tu correo

## Paso 2: Obtener credenciales

1. Inicia sesión en [https://console.cloudinary.com](https://console.cloudinary.com)
2. En el Dashboard verás:
   - **Cloud Name**: ejemplo `dxxxxx`
   - **API Key**: ejemplo `123456789012345`
   - **API Secret**: haz clic en "View" para verlo

## Paso 3: Crear Upload Preset

1. Ve a **Settings** (⚙️ arriba a la derecha)
2. Click en **Upload** (en el menú lateral)
3. Scroll hasta **Upload presets**
4. Click en **Add upload preset**
5. Configura:
   - **Preset name**: `rentacar_vehiculos`
   - **Signing mode**: **Unsigned** (importante!)
   - **Folder**: `rentacar/vehiculos`
   - **Allowed formats**: `jpg, png, webp, jpeg`
   - **Max file size**: `10 MB`
   - **Image transformations**: 
     - Width: 1200
     - Height: 800
     - Crop: limit
6. Click **Save**

## Paso 4: Configurar variables de entorno

Abre tu archivo `.env.local` y reemplaza:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

## Paso 5: Reiniciar el servidor

```bash
# Ctrl+C para detener
npm run dev
```

## ✅ Listo!

Ahora en el formulario de vehículos:
1. Click en "Seleccionar imagen"
2. Arrastra o selecciona una foto
3. Se sube automáticamente a Cloudinary
4. La URL se guarda en la base de datos

## Límites del plan gratuito:
- ✅ 25 GB de almacenamiento
- ✅ 25 GB de ancho de banda/mes
- ✅ 25,000 transformaciones/mes
- ✅ Suficiente para tu proyecto universitario

## Estructura de archivos en Cloudinary:
```
rentacar/
  └── vehiculos/
      ├── imagen1.jpg
      ├── imagen2.jpg
      └── imagen3.jpg
```

¿Dudas? Las URLs generadas serán algo como:
`https://res.cloudinary.com/dxxxxx/image/upload/v1234567890/rentacar/vehiculos/abc123.jpg`
