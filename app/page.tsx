'use client';

import { useEffect, useState } from 'react';
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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <section className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Presentación y Portfolio</h1>
        <p className="text-neutral-400">Bienvenido a la galería de proyectos destacados.</p>
      </section>

      <section className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-neutral-500">Cargando portfolio...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                {item.mediaType === 'IMAGE' ? (
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-48 object-cover rounded mb-3" />
                ) : (
                  <video src={item.mediaUrl} controls className="w-full h-48 object-cover rounded mb-3" />
                )}
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}