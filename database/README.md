# =====================================================
# Instrucciones para Configurar la Base de Datos
# =====================================================

## 1. IMPORTAR EL SCHEMA EN phpMyAdmin

1. Abre phpMyAdmin en: https://phpmyadmin.alwaysdata.com
2. Inicia sesión con:
   - Usuario: rentacar
   - Contraseña: [tu contraseña]

3. Selecciona la base de datos `rentacar_db` en el panel izquierdo

4. Ve a la pestaña "SQL" en el menú superior

5. Copia y pega TODO el contenido del archivo `database/schema.sql`

6. Haz clic en "Go" o "Continuar" para ejecutar el script

7. Verifica que todas las tablas se hayan creado correctamente en la pestaña "Structure"


## 2. IMPORTAR DATOS DE EJEMPLO (Opcional)

1. En phpMyAdmin, con `rentacar_db` seleccionada

2. Ve nuevamente a la pestaña "SQL"

3. Copia y pega TODO el contenido del archivo `database/seed.sql`

4. Haz clic en "Go" o "Continuar"

5. Verifica los datos en cada tabla haciendo clic en "Browse"


## 3. CONFIGURAR EL ARCHIVO .env

1. Copia el archivo `.env.example` y renómbralo a `.env`

2. Edita el archivo `.env` y cambia:
   ```
   DATABASE_PASSWORD=TU_CONTRASEÑA_AQUI
   ```
   Por tu contraseña real de AlwaysData

3. Guarda el archivo


## 4. CREDENCIALES DE ACCESO (Datos de Ejemplo)

### Usuario Administrador:
- Email: admin@rentacar.com
- Contraseña: admin123

### Usuario Cliente:
- Email: cliente@demo.com
- Contraseña: cliente123

**IMPORTANTE:** Las contraseñas están hasheadas en la base de datos. 
Necesitarás implementar el registro/login en el backend para generar los hashes correctos.


## 5. ESTRUCTURA DE LA BASE DE DATOS

### Tablas Creadas:
- ✅ categorias (6 categorías de vehículos)
- ✅ usuarios (4 usuarios: 1 admin, 3 clientes)
- ✅ vehiculos (10 vehículos de ejemplo)
- ✅ rentas (4 rentas de ejemplo)
- ✅ pagos (3 pagos completados)
- ✅ favoritos (4 vehículos favoritos)
- ✅ resenas (3 reseñas)
- ✅ mantenimientos (3 registros)
- ✅ notificaciones (para alertas)
- ✅ configuracion (ajustes del sistema)


## 6. CONEXIÓN DESDE EL BACKEND

Tu cadena de conexión será:
```
mysql://rentacar:[PASSWORD]@mysql-rentacar.alwaysdata.net:3306/rentacar_db
```

### Para TypeORM (NestJS):
```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // ¡IMPORTANTE! Nunca usar true en producción
})
```


## 7. SOLUCIÓN DE PROBLEMAS

### Error de conexión:
- Verifica que el host sea: `mysql-rentacar.alwaysdata.net`
- Verifica tu contraseña en el panel de AlwaysData
- Asegúrate de que el puerto sea 3306

### Tablas no se crean:
- Ejecuta el script `schema.sql` línea por línea
- Revisa los mensajes de error en phpMyAdmin
- Verifica que `rentacar_db` exista

### No puedo importar datos:
- Asegúrate de ejecutar primero `schema.sql`
- Luego ejecuta `seed.sql`
- El orden es importante


## 8. PRÓXIMOS PASOS

1. ✅ Base de datos configurada
2. ⏳ Crear proyecto NestJS backend
3. ⏳ Implementar autenticación JWT
4. ⏳ Crear endpoints REST API
5. ⏳ Conectar frontend con backend


---
**Documentación creada para RentaCar - 2024**
