'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEvents, getGalleryByCode, getImageUrl, GalleryEvent } from '@/services/api';

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80';

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Estado del popup al hacer clic en un evento
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    getEvents()
      .then((data) => setEvents(data))
      .catch((err) => setListError(err.message || 'Error al cargar los eventos'))
      .finally(() => setLoadingList(false));
  }, []);

  const handleOpenPopup = (event: GalleryEvent) => {
    setSelectedEvent(event);
    setAccessCode('');
    setError(null);
    setLoading(false);
  };

  const handleClosePopup = () => {
    if (loading) return;
    setSelectedEvent(null);
    setAccessCode('');
    setError(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !accessCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getGalleryByCode(accessCode.trim());

      if (Number(data.id) !== Number(selectedEvent.id)) {
        setError('El código introducido no corresponde a este evento.');
        setLoading(false);
        return;
      }

      router.push(`/events/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Código no válido o el evento no existe.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-neutral-950 text-neutral-100 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Eventos</h1>

        {loadingList && (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-full h-52 md:h-64 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {listError && (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/60 p-4 rounded-xl">
            {listError}
          </p>
        )}

        {!loadingList && !listError && events.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center text-neutral-400">
            No hay eventos disponibles en este momento.
          </div>
        )}

        <div className="flex flex-col gap-5">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => handleOpenPopup(event)}
              className="group relative block w-full h-52 md:h-64 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-500 transition shadow-xl cursor-pointer"
            >
              <img
                src={event.bannerImageUrl ? getImageUrl(event.bannerImageUrl) : DEFAULT_BANNER}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
              <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  {event.title}
                </h2>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popup para pedir el código del evento */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-6"
          onClick={handleClosePopup}
        >
          <div
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <h2 className="text-2xl font-extrabold mb-2">{selectedEvent.title}</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Introduce tu código de acceso privado para ver tus fotografías.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="ej. GV-2026"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-white transition tracking-wide text-center uppercase"
                autoFocus
                required
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  disabled={loading}
                  className="w-1/2 bg-neutral-800 text-neutral-200 font-bold py-3 rounded-lg hover:bg-neutral-700 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-white text-neutral-900 font-bold py-3 rounded-lg hover:bg-neutral-200 transition disabled:opacity-50"
                >
                  {loading ? 'Verificando...' : 'Acceder al Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}