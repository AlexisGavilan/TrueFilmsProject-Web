'use client';

import { useEffect, useState } from 'react';
import { getAboutMe, getImageUrl, AboutMeData } from '@/services/api';

export default function HomePage() {
  const [data, setData] = useState<AboutMeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAboutMeData();
  }, []);

  const loadAboutMeData = async () => {
    try {
      setLoading(true);
      const aboutMeData = await getAboutMe();
      setData(aboutMeData);
    } catch (err: any) {
      console.error('Error al cargar la información de Sobre mí:', err);
      setError('No se pudo cargar el contenido.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <p className="text-neutral-500 animate-pulse">Cargando...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <p className="text-neutral-400">{error || 'No hay datos disponibles.'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 pb-16">
      {/* 1. FOTO EN GRANDE AL PRINCIPIO (HERO BANNER) */}
      <section className="relative w-full h-[45vh] md:h-[60vh] overflow-hidden bg-neutral-900 border-b border-neutral-800">
        {data.heroImageUrl ? (
          <img
            src={getImageUrl(data.heroImageUrl)}
            alt="Cabecera Sobre Mí"
            className="w-full h-full object-cover object-center filter brightness-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            Sin imagen de cabecera
          </div>
        )}
      </section>

      {/* CONTENEDOR CENTRALIZADO DE TEXTO Y GALERÍA */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12 space-y-12">
        {/* 2. TEXTOS: TÍTULO, SUBTÍTULO Y DESCRIPCIÓN */}
        <section className="max-w-3xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-neutral-100">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-base md:text-lg text-neutral-400 font-light">
              {data.subtitle}
            </p>
          )}
          {data.description && (
            <p className="text-neutral-300 leading-relaxed text-sm md:text-base pt-2 whitespace-pre-line">
              {data.description}
            </p>
          )}
        </section>

        {/* 3. FILA DE 4 IMÁGENES HORIZONTALES */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.galleryImages && data.galleryImages.length > 0 ? (
              data.galleryImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800 group relative"
                >
                  {imgUrl ? (
                    <img
                      src={getImageUrl(imgUrl)}
                      alt={`Foto de galería ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">
                      Sin imagen {index + 1}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-neutral-600 text-sm">
                No hay imágenes de galería disponibles.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}