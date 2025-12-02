import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-amber-50 text-gray-800 mt-auto border-t border-amber-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-stone-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">RC</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">RentaCar</span>
            </div>
            <p className="text-gray-600 text-sm">
              Tu mejor opción para rentar vehículos de calidad al mejor precio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vehiculos" className="text-gray-600 hover:text-stone-700 transition">
                  Vehículos
                </Link>
              </li>
              <li>
                <Link href="/mis-rentas" className="text-gray-600 hover:text-stone-700 transition">
                  Mis Rentas
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="text-gray-600 hover:text-stone-700 transition">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda" className="text-gray-600 hover:text-stone-700 transition">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-600 hover:text-stone-700 transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-600 hover:text-stone-700 transition">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Contacto</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Email: info@rentacar.com</li>
              <li>Tel: +52 (55) 1234-5678</li>
              <li>Dirección: CDMX, México</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-200 mt-8 pt-8 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} RentaCar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
