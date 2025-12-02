# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a RentaCar! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Commits y Pull Requests](#commits-y-pull-requests)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor, reporta comportamientos inaceptables.

## 🚀 ¿Cómo puedo contribuir?

### Reportar Bugs

Si encuentras un bug:

1. **Verifica** que no haya sido reportado en [Issues](https://github.com/jona2022-02/RentaCar/issues)
2. **Abre un nuevo issue** con:
   - Título descriptivo
   - Pasos para reproducir el problema
   - Comportamiento esperado vs actual
   - Screenshots (si aplica)
   - Versión de Node.js y navegador

### Sugerir Mejoras

Para sugerir nuevas características:

1. **Abre un issue** con el tag `enhancement`
2. Describe la funcionalidad deseada
3. Explica por qué sería útil
4. Proporciona ejemplos de uso

### Contribuir Código

1. **Fork** el repositorio
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```
3. **Haz tus cambios** siguiendo los estándares
4. **Haz commit** de tus cambios
5. **Push** a tu fork
6. **Abre un Pull Request**

## 💻 Proceso de Desarrollo

### Configuración Inicial

```bash
# Clonar el repo
git clone https://github.com/jona2022-02/RentaCar.git
cd RentaCar

# Instalar dependencias
cd rentacar-front
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Generar Prisma Client
npx prisma generate

# Iniciar en desarrollo
npm run dev
```

### Estructura de Ramas

- `main` - Código de producción estable
- `develop` - Rama de desarrollo principal
- `feature/nombre` - Nuevas características
- `fix/nombre` - Correcciones de bugs
- `docs/nombre` - Cambios en documentación

### Testing

Antes de hacer un PR:

```bash
# Ejecutar lint
npm run lint

# Build para verificar que compile
npm run build
```

## 📝 Estándares de Código

### TypeScript

- Usa **TypeScript** para todo el código nuevo
- Define tipos e interfaces apropiados
- Evita el uso de `any`

```typescript
// ✅ Bueno
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

// ❌ Malo
const usuario: any = {...}
```

### Componentes React

- Usa **componentes funcionales** con hooks
- Nombra componentes en **PascalCase**
- Extrae lógica compleja a custom hooks

```typescript
// ✅ Bueno
export default function TarjetaVehiculo({ vehiculo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}

// ❌ Malo
export default function tarjeta_vehiculo(props) {
  // ...
}
```

### Naming Conventions

- **Componentes**: `PascalCase` (ej: `FormularioVehiculo.tsx`)
- **Archivos utils**: `camelCase` (ej: `generar-contrato-pdf.ts`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `MAX_FILE_SIZE`)
- **Variables/Funciones**: `camelCase` (ej: `obtenerVehiculos`)

### Estilos

- Usa **Tailwind CSS** para estilos
- Agrupa clases relacionadas
- Usa componentes de **shadcn/ui** cuando sea posible

```tsx
// ✅ Bueno
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ Malo (estilos inline)
<div style={{ display: 'flex', padding: '24px' }}>
```

### Prisma/Base de Datos

- Usa **Prisma Client** para queries
- Evita SQL raw innecesario
- Nombres de campos en español (convención del proyecto)

```typescript
// ✅ Bueno
const vehiculos = await prisma.vehiculo.findMany({
  where: { disponible: true },
  include: { categoria: true }
});

// ❌ Malo
const vehiculos = await prisma.$queryRaw`SELECT * FROM Vehiculo`;
```

## 📤 Commits y Pull Requests

### Mensajes de Commit

Usa mensajes descriptivos siguiendo este formato:

```
tipo: descripción breve

Descripción más detallada (opcional)
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin afectar lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**

```bash
feat: agregar filtro por categoría en vehículos

fix: corregir validación de fechas en reservas

docs: actualizar README con instrucciones de deploy

refactor: simplificar lógica de cálculo de totales
```

### Pull Requests

Al crear un PR:

1. **Título descriptivo** que resuma los cambios
2. **Descripción detallada**:
   - ¿Qué cambia?
   - ¿Por qué es necesario?
   - ¿Cómo se probó?
3. **Referencias** a issues relacionados
4. **Screenshots** si hay cambios visuales
5. **Checklist**:
   - [ ] El código compila sin errores
   - [ ] Los estilos son responsive
   - [ ] La funcionalidad fue probada
   - [ ] La documentación fue actualizada

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Cambio que rompe compatibilidad
- [ ] Documentación

## ¿Cómo ha sido probado?
Describe cómo probaste los cambios.

## Checklist
- [ ] El código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado en diferentes navegadores

## Screenshots (si aplica)
Agrega capturas de pantalla de los cambios.

## Issues relacionados
Closes #123
```

## 🎯 Áreas de Contribución

### Prioridades Actuales

- 🔴 **Alta prioridad**
  - Tests unitarios y de integración
  - Mejoras de rendimiento
  - Corrección de bugs reportados

- 🟡 **Media prioridad**
  - Nuevas funcionalidades
  - Mejoras de UI/UX
  - Refactorización de código

- 🟢 **Baja prioridad**
  - Documentación adicional
  - Ejemplos de uso
  - Optimizaciones menores

### Características Deseadas

- [ ] Sistema de notificaciones por email
- [ ] Dashboard de métricas mejorado
- [ ] Búsqueda avanzada de vehículos
- [ ] Sistema de valoraciones
- [ ] Chat de soporte en vivo
- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro

## 🆘 ¿Necesitas Ayuda?

Si tienes preguntas:

1. Revisa la [documentación](./docs/README.md)
2. Busca en [Issues cerrados](https://github.com/jona2022-02/RentaCar/issues?q=is%3Aissue+is%3Aclosed)
3. Abre un nuevo issue con la etiqueta `question`

## 📧 Contacto

- **GitHub**: [@jona2022-02](https://github.com/jona2022-02)
- **Issues**: [Crear nuevo issue](https://github.com/jona2022-02/RentaCar/issues/new)

---

¡Gracias por contribuir a RentaCar! 🚗💨
