import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto);
}

export function formatearFecha(fecha: Date | string): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(fecha));
}

export function calcularDias(fechaInicio: Date, fechaFin: Date): number {
  const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calcularPrecioRenta(precioPorDia: number, fechaInicio: Date, fechaFin: Date): number {
  const dias = calcularDias(fechaInicio, fechaFin);
  return precioPorDia * dias;
}
