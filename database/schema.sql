-- =====================================================
-- Script SQL para Sistema RentaCar
-- Base de datos: MySQL/MariaDB
-- =====================================================

-- Usar la base de datos
USE rentacar_db;

-- =====================================================
-- TABLA: categorias
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150),
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'México',
    fecha_nacimiento DATE,
    numero_licencia VARCHAR(50),
    rol ENUM('ADMIN', 'CLIENTE') DEFAULT 'CLIENTE',
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: vehiculos
-- =====================================================
CREATE TABLE IF NOT EXISTS vehiculos (
    id VARCHAR(36) PRIMARY KEY,
    categoria_id VARCHAR(36) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    año INT NOT NULL,
    color VARCHAR(50),
    placa VARCHAR(20) NOT NULL UNIQUE,
    numero_motor VARCHAR(50),
    numero_chasis VARCHAR(50),
    kilometraje INT DEFAULT 0,
    tipo_combustible ENUM('GASOLINA', 'DIESEL', 'ELECTRICO', 'HIBRIDO') DEFAULT 'GASOLINA',
    transmision ENUM('MANUAL', 'AUTOMATICA') DEFAULT 'MANUAL',
    numero_pasajeros INT DEFAULT 5,
    numero_puertas INT DEFAULT 4,
    tiene_aire_acondicionado BOOLEAN DEFAULT TRUE,
    descripcion TEXT,
    precio_dia DECIMAL(10, 2) NOT NULL,
    precio_semana DECIMAL(10, 2),
    precio_mes DECIMAL(10, 2),
    deposito_requerido DECIMAL(10, 2) DEFAULT 0.00,
    imagenes JSON,
    disponible BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    INDEX idx_disponible (disponible),
    INDEX idx_categoria (categoria_id),
    INDEX idx_precio (precio_dia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: rentas
-- =====================================================
CREATE TABLE IF NOT EXISTS rentas (
    id VARCHAR(36) PRIMARY KEY,
    vehiculo_id VARCHAR(36) NOT NULL,
    usuario_id VARCHAR(36) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fecha_entrega_real DATETIME,
    fecha_devolucion_real DATETIME,
    dias_renta INT NOT NULL,
    precio_total DECIMAL(10, 2) NOT NULL,
    deposito DECIMAL(10, 2) DEFAULT 0.00,
    costo_adicional DECIMAL(10, 2) DEFAULT 0.00,
    razon_adicional TEXT,
    lugar_recogida VARCHAR(200),
    lugar_entrega VARCHAR(200),
    kilometraje_inicio INT,
    kilometraje_fin INT,
    nivel_combustible_inicio ENUM('VACIO', '1/4', '1/2', '3/4', 'LLENO'),
    nivel_combustible_fin ENUM('VACIO', '1/4', '1/2', '3/4', 'LLENO'),
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
    notas TEXT,
    foto_antes JSON,
    foto_despues JSON,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_usuario (usuario_id),
    INDEX idx_vehiculo (vehiculo_id),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: pagos
-- =====================================================
CREATE TABLE IF NOT EXISTS pagos (
    id VARCHAR(36) PRIMARY KEY,
    renta_id VARCHAR(36) NOT NULL,
    usuario_id VARCHAR(36) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL', 'STRIPE') NOT NULL,
    referencia VARCHAR(100),
    estado ENUM('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO') DEFAULT 'PENDIENTE',
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (renta_id) REFERENCES rentas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_renta (renta_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
