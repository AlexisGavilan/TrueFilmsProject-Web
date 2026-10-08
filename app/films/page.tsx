'use client';

import { useEffect, useState } from 'react';
import { getFilms, Film } from '@/services/api';

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    getFilms()
      .then(setFilms)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Cortometrajes & Documentales</h1>
        <p className="text-neutral-400 mb-10">Proyectos cinematográficos y piezas documentales independientes.</p>

        {loading ? (
          <p className="text-neutral-500 text-center py-12">Cargando catálogo de vídeos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {films.map((film) => (
              <div
                key={film.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition"
              >
                <div>
                  <div className="relative h-48 bg-neutral-800 overflow-hidden">
                    <img
                      src={film.thumbnailUrl || 'https://via.placeholder.com/600x400'}
                      alt={film.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-3 right-3 bg-black/80 text-xs px-2 py-1 rounded">
                      {film.durationMinutes} min
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-baseline mb-2">
                      <h2 className="text-xl font-bold">{film.title}</h2>
                      <span className="text-xs text-neutral-500 font-mono">{film.releaseYear}</span>
                    </div>
                    <p className="text-sm text-neutral-400 line-clamp-3">{film.synopsis}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedFilm(film)}
                    className="w-full bg-neutral-100 hover:bg-white text-neutral-900 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    ▶ Ver Cortometraje
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Reproductor de Vídeo */}
      {selectedFilm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 flex justify-between items-center border-b border-neutral-800">
              <h3 className="font-bold text-lg">{selectedFilm.title} ({selectedFilm.releaseYear})</h3>
              <button
                onClick={() => setSelectedFilm(null)}
                className="text-neutral-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>
            
            <div className="relative aspect-video bg-black">
              {selectedFilm.videoUrl.includes('youtube') || selectedFilm.videoUrl.includes('vimeo') ? (
                <iframe
                  src={selectedFilm.videoUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedFilm.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>

            <div className="p-6">
              <p className="text-neutral-300 text-sm leading-relaxed">{selectedFilm.synopsis}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}