-- =====================================================
-- Datos de Ejemplo (Seed Data) para RentaCar
-- =====================================================

USE rentacar_db;

-- =====================================================
-- INSERTAR CATEGORÍAS
-- =====================================================
INSERT INTO categorias (id, nombre, descripcion) VALUES
('cat-1', 'Sedán', 'Vehículos sedán compactos y medianos'),
('cat-2', 'SUV', 'Vehículos utilitarios deportivos'),
('cat-3', 'Camioneta', 'Camionetas pickup y de carga'),
('cat-4', 'Deportivo', 'Vehículos deportivos de alto rendimiento'),
('cat-5', 'Van', 'Vans y minivans familiares'),
('cat-6', 'Eléctrico', 'Vehículos eléctricos e híbridos');

-- =====================================================
-- INSERTAR USUARIOS (Contraseñas: admin123 y cliente123 hasheadas)
-- =====================================================
INSERT INTO usuarios (id, email, password, nombre, apellido, telefono, rol, estado) VALUES
('admin-1', 'admin@rentacar.com', '$2b$10$rZYb5qFQXwJKF5Y5YqGvVeK3kM8PYO3XqJKP5m5M5M5M5M5M5M5M5', 'Administrador', 'Sistema', '+52 123 456 7890', 'ADMIN', 'ACTIVO'),
('cliente-1', 'cliente@demo.com', '$2b$10$rZYb5qFQXwJKF5Y5YqGvVeK3kM8PYO3XqJKP5m5M5M5M5M5M5M5M5', 'Juan', 'Pérez', '+52 987 654 3210', 'CLIENTE', 'ACTIVO'),
('cliente-2', 'maria@email.com', '$2b$10$rZYb5qFQXwJKF5Y5YqGvVeK3kM8PYO3XqJKP5m5M5M5M5M5M5M5M5', 'María', 'González', '+52 555 123 4567', 'CLIENTE', 'ACTIVO'),
('cliente-3', 'carlos@email.com', '$2b$10$rZYb5qFQXwJKF5Y5YqGvVeK3kM8PYO3XqJKP5m5M5M5M5M5M5M5M5', 'Carlos', 'Rodríguez', '+52 555 987 6543', 'CLIENTE', 'ACTIVO');

-- =====================================================
-- INSERTAR VEHÍCULOS
-- =====================================================
INSERT INTO vehiculos (id, categoria_id, marca, modelo, año, color, placa, precio_dia, precio_semana, precio_mes, disponible, estado, numero_pasajeros, transmision, imagenes) VALUES
('veh-1', 'cat-1', 'Toyota', 'Corolla', 2023, 'Blanco', 'ABC-123-MX', 450.00, 2800.00, 10000.00, TRUE, 'EXCELENTE', 5, 'AUTOMATICA', '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800", "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]'),
('veh-2', 'cat-1', 'Honda', 'Civic', 2023, 'Negro', 'DEF-456-MX', 500.00, 3200.00, 11500.00, TRUE, 'EXCELENTE', 5, 'AUTOMATICA', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]'),
('veh-3', 'cat-2', 'Nissan', 'X-Trail', 2022, 'Gris', 'GHI-789-MX', 750.00, 4800.00, 18000.00, TRUE, 'BUENO', 7, 'AUTOMATICA', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]'),
('veh-4', 'cat-2', 'Mazda', 'CX-5', 2023, 'Rojo', 'JKL-012-MX', 800.00, 5200.00, 19500.00, TRUE, 'EXCELENTE', 5, 'AUTOMATICA', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]'),
('veh-5', 'cat-3', 'Ford', 'Ranger', 2022, 'Azul', 'MNO-345-MX', 900.00, 5800.00, 22000.00, TRUE, 'BUENO', 5, 'MANUAL', '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]'),
('veh-6', 'cat-4', 'Chevrolet', 'Camaro', 2023, 'Amarillo', 'PQR-678-MX', 1500.00, 9800.00, 38000.00, TRUE, 'EXCELENTE', 4, 'AUTOMATICA', '["https://images.unsplash.com/photo-1584345604476-8ec5f1b0b1b2?w=800"]'),
('veh-7', 'cat-5', 'Chrysler', 'Pacifica', 2022, 'Plateado', 'STU-901-MX', 850.00, 5500.00, 21000.00, TRUE, 'BUENO', 8, 'AUTOMATICA', '["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"]'),
('veh-8', 'cat-6', 'Tesla', 'Model 3', 2023, 'Blanco', 'VWX-234-MX', 1200.00, 7800.00, 30000.00, TRUE, 'EXCELENTE', 5, 'AUTOMATICA', '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"]'),
('veh-9', 'cat-1', 'Volkswagen', 'Jetta', 2022, 'Gris', 'YZA-567-MX', 480.00, 3000.00, 11000.00, TRUE, 'BUENO', 5, 'MANUAL', '["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"]'),
('veh-10', 'cat-2', 'Hyundai', 'Tucson', 2023, 'Verde', 'BCD-890-MX', 720.00, 4700.00, 17500.00, FALSE, 'MANTENIMIENTO', 5, 'AUTOMATICA', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]');

-- =====================================================
-- INSERTAR RENTAS DE EJEMPLO
-- =====================================================
INSERT INTO rentas (id, vehiculo_id, usuario_id, fecha_inicio, fecha_fin, dias_renta, precio_total, estado) VALUES
('rent-1', 'veh-1', 'cliente-1', '2024-11-15', '2024-11-18', 3, 1350.00, 'COMPLETADA'),
('rent-2', 'veh-3', 'cliente-2', '2024-11-20', '2024-11-25', 5, 3750.00, 'COMPLETADA'),
('rent-3', 'veh-2', 'cliente-1', '2024-12-01', '2024-12-05', 4, 2000.00, 'CONFIRMADA'),
('rent-4', 'veh-8', 'cliente-3', '2024-12-10', '2024-12-15', 5, 6000.00, 'PENDIENTE');

-- =====================================================
-- INSERTAR PAGOS
-- =====================================================
INSERT INTO pagos (id, renta_id, usuario_id, monto, metodo_pago, estado) VALUES
('pago-1', 'rent-1', 'cliente-1', 1350.00, 'TARJETA', 'COMPLETADO'),
('pago-2', 'rent-2', 'cliente-2', 3750.00, 'TRANSFERENCIA', 'COMPLETADO'),
('pago-3', 'rent-3', 'cliente-1', 2000.00, 'TARJETA', 'COMPLETADO');

-- =====================================================
-- FIN DE DATOS DE EJEMPLO
-- =====================================================
