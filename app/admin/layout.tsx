'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Gestión de Eventos', href: '/admin' },
    { name: 'Sección "Sobre Mí"', href: '/admin/about-me' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabecera Principal del Panel */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
            <p className="text-sm text-neutral-400">Control de eventos, servidor y contenidos de la web</p>
          </div>
          <Link
            href="/"
            className="text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-2 rounded border border-neutral-700 w-fit transition"
          >
            ← Volver a la web pública
          </Link>
        </header>

        {/* Navegación por Pestañas (Tabs) */}
        <nav className="flex space-x-2 border-b border-neutral-800 pb-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-amber-400 border-t border-x border-neutral-800 border-b-neutral-950 -mb-[1px]'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Contenido de la Sub-ruta actual */}
        <main>{children}</main>
      </div>
    </div>
  );
}