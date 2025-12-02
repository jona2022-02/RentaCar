# 🚀 Guía de Despliegue - RentaCar

Esta guía te ayudará a desplegar el proyecto en producción.

## 📋 Prerequisitos

- Cuenta de GitHub
- Cuenta de Vercel (gratis)
- Base de datos MySQL en producción (AlwaysData, PlanetScale, etc.)

## 🎯 Subir a GitHub

### 1. Crear Repositorio (Ya hecho)

El repositorio ya está creado en: https://github.com/jona2022-02/RentaCar

### 2. Subir Código

```bash
# Navegar al proyecto
cd c:\Users\Jonathan\Desktop\RentaCar

# Verificar que todo está listo
git status

# Hacer push al repositorio
git push -u origin main
```

**Nota**: Si Git pide autenticación, usa tu token de GitHub personal.

### 3. Generar Token de GitHub (si es necesario)

1. Ve a GitHub.com → Settings → Developer settings → Personal access tokens
2. Click en "Generate new token (classic)"
3. Dale un nombre: "RentaCar Deploy"
4. Selecciona permisos: `repo` (completo)
5. Click "Generate token"
6. **Copia el token** (solo se muestra una vez)
7. Úsalo como contraseña al hacer `git push`

## ☁️ Desplegar en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Ve a [vercel.com](https://vercel.com)
2. Click "New Project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `RentaCar`
5. Configura:
   - **Framework Preset**: Next.js
   - **Root Directory**: `rentacar-front`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Opción 2: Desde CLI

```bash
cd rentacar-front
npm install -g vercel
vercel login
vercel --prod
```

## 🔧 Configurar Variables de Entorno en Vercel

En el panel de Vercel, ve a **Settings → Environment Variables** y agrega:

### Variables Requeridas

```env
DATABASE_URL
valor: mysql://usuario:contraseña@host:3306/rentacar_db
```

```env
NEXTAUTH_SECRET
valor: [genera uno con: openssl rand -base64 32]
```

```env
NEXTAUTH_URL
valor: https://tu-app.vercel.app
```

### Variables Opcionales (Cloudinary)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
valor: tu_cloud_name
```

```env
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
valor: tu_preset
```

## 🗄️ Base de Datos en Producción

### Opción 1: AlwaysData (Actual)

Si ya tienes AlwaysData configurado:

```env
DATABASE_URL="mysql://rentacar:contraseña@mysql-rentacar.alwaysdata.net:3306/rentacar_db"
```

### Opción 2: PlanetScale (Recomendado)

1. Crear cuenta en [planetscale.com](https://planetscale.com)
2. Crear nueva base de datos
3. Copiar connection string
4. Pegarlo en `DATABASE_URL` en Vercel

### Opción 3: Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. Crear proyecto MySQL
3. Copiar connection string
4. Configurar en Vercel

## 📦 Prisma en Producción

Vercel ejecuta automáticamente:

```bash
npx prisma generate
```

Si tienes problemas, agrega en `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

## ✅ Checklist de Despliegue

Antes de hacer push a producción:

- [ ] `.env` no está en el repositorio
- [ ] `.gitignore` excluye archivos sensibles
- [ ] Variables de entorno configuradas en Vercel
- [ ] Base de datos en producción lista
- [ ] Esquema de BD importado
- [ ] `NEXTAUTH_URL` apunta a tu dominio
- [ ] `NEXTAUTH_SECRET` es seguro y único
- [ ] Build local exitoso (`npm run build`)

## 🔄 Actualizar Proyecto

Después del despliegue inicial:

```bash
# Hacer cambios en el código
git add .
git commit -m "descripción de cambios"
git push origin main
```

Vercel desplegará automáticamente cada push a `main`.

## 🌐 Dominio Personalizado

Para usar tu propio dominio:

1. En Vercel: Settings → Domains
2. Agregar tu dominio
3. Configurar DNS según instrucciones de Vercel
4. Actualizar `NEXTAUTH_URL` con tu dominio

## 🐛 Solución de Problemas

### Error: Prisma Client no generado

```bash
# En settings de Vercel, agregar comando:
Build Command: npx prisma generate && npm run build
```

### Error: Database connection

- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate que la BD permita conexiones externas
- Revisa que el host/puerto sean correctos

### Error: NextAuth

- Verifica `NEXTAUTH_SECRET` esté configurado
- Verifica `NEXTAUTH_URL` sea la URL correcta de producción
- En desarrollo local debe ser `http://localhost:3000`

## 📊 Monitoreo

Vercel provee:
- **Analytics**: Métricas de uso
- **Logs**: Logs en tiempo real
- **Performance**: Tiempos de carga

Accede en: Dashboard → Tu Proyecto → Tabs superiores

## 🎉 ¡Listo!

Tu aplicación estará disponible en:
```
https://tu-proyecto.vercel.app
```

---

## 📞 Soporte

¿Problemas con el despliegue?
- Revisa los logs en Vercel
- Consulta [docs de Next.js](https://nextjs.org/docs/deployment)
- Abre un [issue](https://github.com/jona2022-02/RentaCar/issues)
