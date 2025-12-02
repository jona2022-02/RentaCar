// Enums en español
export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  ADMIN = 'ADMIN',
}

export enum Transmision {
  MANUAL = 'MANUAL',
  AUTOMATICA = 'AUTOMATICA',
}

export enum TipoCombustible {
  GASOLINA = 'GASOLINA',
  DIESEL = 'DIESEL',
  ELECTRICO = 'ELECTRICO',
  HIBRIDO = 'HIBRIDO',
}

export enum EstadoRenta {
  PENDIENTE = 'PENDIENTE',
  ACTIVA = 'ACTIVA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

export enum MetodoPago {
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  PAYPAL = 'PAYPAL',
  EFECTIVO = 'EFECTIVO',
}

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  FALLIDO = 'FALLIDO',
}

// Tipos de Usuario
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  rol: RolUsuario;
  creadoEn: Date;
  actualizadoEn: Date;
}

// Tipos de Vehículo
export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  color: string | null;
  precioDia: number;
  precioSemana: number | null;
  precioMes: number | null;
  depositoRequerido: number;
  categoriaId: string;
  categoria?: Categoria;
  imagenes: { url: string } | null;
  disponible: boolean;
  transmision: Transmision;
  tipoCombustible: TipoCombustible;
  numeroPasajeros: number;
  numeroPuertas: number;
  tieneAireAcondicionado: boolean;
  kilometraje: number;
  numeroMotor: string | null;
  numeroChasis: string | null;
  descripcion: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

// Tipos de Categoría
export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagen?: string;
  vehiculos?: Vehiculo[];
}

// Tipos de Renta
export interface Renta {
  id: string;
  usuarioId: string;
  usuario?: Usuario;
  vehiculoId: string;
  vehiculo?: Vehiculo;
  fechaInicio: Date;
  fechaFin: Date;
  precioTotal: number;
  estado: EstadoRenta;
  pagoId?: string;
  pago?: Pago;
  creadoEn: Date;
  actualizadoEn: Date;
}

// Tipos de Pago
export interface Pago {
  id: string;
  rentaId: string;
  monto: number;
  metodo: MetodoPago;
  estado: EstadoPago;
  transaccionId?: string;
  creadoEn: Date;
}

// Tipos de Reseña
export interface Resena {
  id: string;
  usuarioId: string;
  usuario?: Usuario;
  vehiculoId: string;
  vehiculo?: Vehiculo;
  calificacion: number;
  comentario: string;
  creadoEn: Date;
}

// Tipos de Respuesta API
export interface RespuestaApi<T> {
  datos: T;
  mensaje?: string;
  exito: boolean;
}

export interface RespuestaPaginada<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

// Tipos de Formularios
export interface FormularioLogin {
  email: string;
  contraseña: string;
}

export interface FormularioRegistro {
  nombre: string;
  email: string;
  contraseña: string;
  telefono?: string;
}

export interface FormularioRenta {
  vehiculoId: string;
  fechaInicio: Date;
  fechaFin: Date;
}

// Tipos de Filtros
export interface FiltrosVehiculo {
  categoriaId?: string;
  precioMinimo?: number;
  precioMaximo?: number;
  transmision?: Transmision;
  tipoCombustible?: TipoCombustible;
  numeroPasajeros?: number;
  disponible?: boolean;
  busqueda?: string;
}
