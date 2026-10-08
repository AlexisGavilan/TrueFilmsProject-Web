'use client';

import { useState } from 'react';
import { getGalleryByCode, getDownloadUrlByCode, GalleryEvent } from '@/services/api';

export default function EventsPage() {
  const [accessCode, setAccessCode] = useState('');
  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setLoading(true);
    setError(null);
    setEvent(null);

    try {
      const data = await getGalleryByCode(accessCode.trim());
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Error al consultar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
      {!event ? (
        /* Formulario para ingresar el Código de Acceso */
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-extrabold mb-2">Acceso a Eventos</h1>
          <p className="text-sm text-neutral-400 mb-6">
            Introduce el código privado proporcionado para ver tus fotografías.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Ej. BODA-JUAN-2026"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-white transition tracking-wide text-center uppercase"
              required
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-neutral-900 font-bold py-3 rounded-lg hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Acceder al Evento'}
            </button>
          </form>
        </div>
      ) : (
        /* Detalle del Evento Privado al ingresar el código correcto */
        <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Evento Privado
              </span>
              <h1 className="text-3xl font-extrabold mt-1">{event.title}</h1>
            </div>
            <button
              onClick={() => setEvent(null)}
              className="text-xs text-neutral-400 hover:text-white underline"
            >
              Cambiar código
            </button>
          </div>

          <p className="text-xs text-neutral-400 mb-6">Fecha del evento: {event.eventDate}</p>
          <p className="text-neutral-300 leading-relaxed mb-8">{event.description}</p>

          <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-neutral-400">
              Estado: <strong className="text-green-400">Galería disponible</strong>
            </span>

            <a
              href={getDownloadUrlByCode(event.accessCode)}
              className="w-full sm:w-auto bg-neutral-100 hover:bg-white text-neutral-900 font-bold py-3 px-6 rounded-lg transition shadow text-center"
            >
              📦 Descargar Fotografías (.zip)
            </a>
          </div>
        </div>
      )}
    </main>
  );
}