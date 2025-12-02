'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
  const { estaAutenticado } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#E8F1FF]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#6D9ACD] via-[#8AB5E0] to-[#5F8EBB] text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
           
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Tu Libertad Sobre Ruedas Comienza Aquí
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Más de 500 vehículos premium listos para ti. Reserva en minutos, viaja sin límites.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 bg-[#2F466B] text-white hover:bg-[#243754] font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <Link href={estaAutenticado ? "/vehiculos" : "/login"}>
                  Explorar Flota Completa
                </Link>
              </Button>

              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 bg-white/90 text-[#2F466B] border-2 border-white hover:bg-white transition-all font-semibold shadow-md"
              >
                <Link href="/registro">Únete Gratis Ahora</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#E8F1FF] to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2F466B] mb-4">
              La Experiencia que Mereces
            </h2>
            <p className="text-xl text-gray-600">
              Innovación y calidad en cada kilómetro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-[#F7FAFF]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#C7D9ED] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#2F466B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#2F466B] mb-2">
                  Tarifas Inteligentes
                </h3>
                <p className="text-gray-600">
                  Precios justos sin sorpresas. Paga solo por lo que usas, cuando lo usas.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-[#F7FAFF]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#DCEAFF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#3A6EA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#2F466B] mb-2">
                  Flota Premium
                </h3>
                <p className="text-gray-600">
                  Vehículos 2023-2024 con mantenimiento certificado y seguro completo.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-[#F7FAFF]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#C9D4E8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#2F466B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#2F466B] mb-2">
                  Siempre Disponible
                </h3>
                <p className="text-gray-600">
                  Reserva online 24/7. Atención al cliente en tiempo real, todos los días.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#F1F6FF]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F466B] mb-2">500+</div>
              <div className="text-gray-700 font-medium">Vehículos Listos</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F466B] mb-2">10K+</div>
              <div className="text-gray-700 font-medium">Viajeros Satisfechos</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F466B] mb-2">50+</div>
              <div className="text-gray-700 font-medium">Ciudades Activas</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F466B] mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Atención Continua</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2F466B] mb-4">
              Así de Fácil es Empezar
            </h2>
            <p className="text-xl text-gray-600">
              De la reserva al volante en minutos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            <div className="text-center">
              <div className="w-20 h-20 bg-[#3A6EA5] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-[#2F466B] mb-2">Encuentra tu Match</h3>
              <p className="text-gray-600">Navega por cientos de opciones y filtra por tus necesidades exactas</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#5F8EBB] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-[#2F466B] mb-2">Reserva al Instante</h3>
              <p className="text-gray-600">Confirmación automática, pago seguro y contrato digital</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#2F466B] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-[#2F466B] mb-2">¡A Rodar!</h3>
              <p className="text-gray-600">Llaves en mano y carretera abierta. Tu aventura comienza</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-[#6D9ACD] to-[#3A6EA5] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
            No Esperes Más. Tu Próximo Destino te Llama
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Miles de kilómetros de libertad están a un clic de distancia
          </p>

          <Button 
            asChild 
            size="lg" 
            className="text-lg px-8 py-6 bg-white text-[#2F466B] hover:bg-gray-200 font-semibold shadow-xl"
          >
            <Link href="/vehiculos">Descubre tu Vehículo Ideal</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
