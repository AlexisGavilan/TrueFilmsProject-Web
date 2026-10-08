'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Matriz modular de navegación (preparada para añadir la 4ª pestaña en el futuro)
  const navItems = [
    { name: 'Presentación', path: '/' },
    { name: 'Eventos', path: '/events' }, // Estructura base para futuros sprints
    { name: 'Cortometrajes', path: '/films' },
    // { name: 'Pestaña 4', path: '/proyectos' }, <-- Añadir fácilmente aquí
  ];

  return (
    <header className="bg-neutral-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wider hover:text-neutral-300 transition">
          STUDIO FOTOGRAFÍA
        </Link>
        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors duration-200 border-b-2 pb-1 ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}