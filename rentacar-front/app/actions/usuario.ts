'use server';

import { getUsuarioActual } from '@/lib/auth';

export async function obtenerUsuarioActual() {
  const usuario = await getUsuarioActual();
  return usuario;
}
