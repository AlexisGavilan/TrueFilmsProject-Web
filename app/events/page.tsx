'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getPortfolioItems, PortfolioItem } from '@/services/api';

export default function HomePage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioItems()
      .then(setItems)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sección Biografía */}
      <section className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden relative border-2 border-neutral-700 flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"
            alt="Fotógrafo"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Capturando Historias y Emociones
          </h1>
          <p className="text-neutral-400 leading-relaxed mb-4">
            Hola, soy fotógrafo y realizador audiovisual. Mi trabajo se centra en capturar la esencia de cada momento, combinando técnica analógica y digital para crear piezas visuales únicas.
          </p>
          <p className="text-neutral-500 text-sm italic">
            Especializado en retrato editorial, fotografía documental y producción cinematográfica.
          </p>
        </div>
      </section>

      {/* Sección Galería Destacada */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 border-b border-neutral-800 pb-3">
          Portfolio Destacado
        </h2>

        {loading ? (
          <p className="text-neutral-500 text-center py-12">Cargando galería...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group relative bg-neutral-900 rounded-lg overflow-hidden shadow-md">
                {item.mediaType === 'IMAGE' ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    controls
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}