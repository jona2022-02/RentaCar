'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SoportePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Centro de Soporte</h1>
        <p className="text-gray-600 mt-2">¿Necesitas ayuda? Estamos aquí para ti</p>
      </div>

      <div className="grid gap-6">
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-[#1E293B] pl-4 py-2">
              <h4 className="font-semibold text-gray-900 mb-1">¿Cómo puedo cancelar una reserva?</h4>
              <p className="text-sm text-gray-600">
                Puedes cancelar tu reserva desde "Mis Rentas". Las cancelaciones con más de 24 horas de anticipación tienen reembolso completo.
              </p>
            </div>
            <div className="border-l-4 border-[#1E293B] pl-4 py-2">
              <h4 className="font-semibold text-gray-900 mb-1">¿Qué documentos necesito para rentar?</h4>
              <p className="text-sm text-gray-600">
                Necesitas una identificación oficial vigente y licencia de conducir válida. Para algunos vehículos se requiere tarjeta de crédito.
              </p>
            </div>
            <div className="border-l-4 border-[#FFFFFF] pl-4 py-2">
              <h4 className="font-semibold text-gray-900 mb-1">¿Incluye seguro el precio?</h4>
              <p className="text-sm text-gray-600">
                Sí, todas nuestras rentas incluyen seguro básico. Puedes contratar coberturas adicionales al momento de la renta.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contacto directo */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">Teléfono</h4>
              <p className="text-lg font-medium text-gray-900">+503 2222-2222</p>
              <p className="text-xs text-gray-500 mt-1">Lun-Dom 24/7</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-lg font-medium text-gray-900">soporte@rentacar.com</p>
              <p className="text-xs text-gray-500 mt-1">Respuesta en 24h</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
