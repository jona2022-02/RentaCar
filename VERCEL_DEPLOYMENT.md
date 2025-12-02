# 🚀 Despliegue en Vercel - RentaCar

Este documento contiene instrucciones específicas para desplegar en Vercel.

## 📋 Pre-requisitos

- ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
- ✅ Base de datos MySQL en producción
- ✅ Repositorio en GitHub

## 🎯 Paso 1: Preparar Base de Datos

### Opción A: AlwaysData (Actual)

Si ya tienes AlwaysData:
1. Asegúrate que el esquema esté importado
2. Copia tu connection string:
```
mysql://rentacar:contraseña@mysql-rentacar.alwaysdata.net:3306/rentacar_db
```

### Opción B: PlanetScale (Recomendado)

1. Crea cuenta en [planetscale.com](https://planetscale.com)
2. Crea nueva base de datos "rentacar-db"
3. Importa el esquema desde `database/schema.sql`
4. Copia el connection string

### Opción C: Railway

1. Crea cuenta en [railway.app](https://railway.app)
2. Nuevo proyecto → Add MySQL
3. Importa esquema
4. Copia connection string

## 🚀 Paso 2: Desplegar en Vercel

### Método 1: Desde Dashboard (Más fácil)

1. Ve a [vercel.com/new](https://vercel.com/new)

2. **Import Git Repository**
   - Conecta tu cuenta de GitHub
   - Selecciona `jona2022-02/RentaCar`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: `Next.js` (auto-detectado)
   - Root Directory: **`rentacar-front`** ⚠️ IMPORTANTE
   - Build Command: `npm run build` (ya configurado)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Environment Variables** - Click "Add" para cada una:

```env
DATABASE_URL
mysql://usuario:contraseña@host:3306/rentacar_db
```

```env
NEXTAUTH_SECRET
(genera con: openssl rand -base64 32)
```

```env
NEXTAUTH_URL
https://tu-proyecto.vercel.app
```

Opcional (Cloudinary):
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
tu_cloud_name
```

```env
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
tu_preset
```

5. **Deploy**
   - Click "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! 🎉

### Método 2: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Navegar a rentacar-front
cd rentacar-front

# Desplegar
vercel

# Seguir prompts:
# Set up and deploy? Y
# Which scope? (tu cuenta)
# Link to existing project? N
# Project name? rentacar
# Directory? ./
# Override settings? N

# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Desplegar a producción
vercel --prod
```

## ⚙️ Paso 3: Verificar Configuración

### Después del primer deploy:

1. **Actualizar NEXTAUTH_URL**
   - Ve a Settings → Environment Variables
   - Edita `NEXTAUTH_URL`
   - Cambia a tu URL de Vercel: `https://tu-proyecto.vercel.app`
   - Save
   - Redeploy: Deployments → ... → Redeploy

2. **Verificar Build Logs**
   - Si falla, revisa los logs
   - Errores comunes:
     - Prisma no generado → Ya está arreglado con `postinstall`
     - Variables de entorno faltantes
     - Connection string incorrecta

3. **Probar la App**
   - Abre tu URL de Vercel
   - Intenta hacer login
   - Verifica que carguen los vehículos

## 🔧 Configuración Avanzada

### Dominio Personalizado

1. Ve a Settings → Domains
2. Add: `tudominio.com`
3. Configura DNS según instrucciones
4. Actualiza `NEXTAUTH_URL` a tu dominio

### Regiones

En `vercel.json` la región está configurada en `iad1` (US East).

Cambiar región:
```json
{
  "regions": ["sfo1"]  // San Francisco
}
```

Opciones: `iad1` (US East), `sfo1` (US West), `gru1` (São Paulo)

### Prisma Generate Automático

Ya está configurado en `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

## 🐛 Solución de Problemas

### Error: "Prisma Client could not be generated"

**Solución:**
```bash
# En settings de Vercel:
Build Command: prisma generate && next build
```

Ya está arreglado en el proyecto.

### Error: "Invalid DATABASE_URL"

**Verificar:**
- Format correcto: `mysql://user:pass@host:port/db`
- Puerto incluido (usualmente 3306)
- Contraseña sin caracteres especiales sin encodear
- Si tiene `@` en la contraseña, usar: `%40`

### Error: "NEXTAUTH_SECRET is not set"

**Solución:**
```bash
# Generar uno nuevo
openssl rand -base64 32

# Agregarlo en Vercel Settings → Environment Variables
```

### Error 500 en producción

**Revisar:**
1. Deployments → Click en el deployment → Function Logs
2. Runtime Logs → Ver error específico
3. Verificar que la BD esté accesible desde internet

## 📊 Monitoreo Post-Deploy

### Analytics
- Vercel → Analytics → Ver métricas de uso

### Logs en Tiempo Real
- Vercel → Deployments → [Último] → Runtime Logs

### Performance
- Vercel → Speed Insights
- Lighthouse scores automáticos

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a `main`:
- Vercel detectará cambios automáticamente
- Iniciará nuevo build
- Desplegará si es exitoso
- URL permanece igual

### Deploy Manual
```bash
cd rentacar-front
vercel --prod
```

## ✅ Checklist Final

Antes de considerar el deploy completo:

- [ ] App carga sin errores
- [ ] Login funciona
- [ ] Dashboard admin accesible
- [ ] Vehículos se muestran correctamente
- [ ] Reservaciones se pueden crear
- [ ] PDFs se generan
- [ ] Imágenes cargan (si usas Cloudinary)
- [ ] Responsive en móviles
- [ ] Variables de entorno configuradas
- [ ] NEXTAUTH_URL correcto
- [ ] Base de datos con datos de prueba

## 🎉 ¡Deploy Exitoso!

Tu aplicación estará en:
```
https://rentacar-[random].vercel.app
```

Puedes cambiar el nombre en: Settings → General → Project Name

---

## 📞 Soporte

- [Documentación Vercel](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Issues del proyecto](https://github.com/jona2022-02/RentaCar/issues)
