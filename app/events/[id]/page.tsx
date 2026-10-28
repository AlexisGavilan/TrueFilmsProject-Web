'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getEventById, 
  getEventPhotos, 
  getDownloadUrlByCode, 
  GalleryEvent, 
  Photo 
} from '@/services/api';
import PhotoGallery from '@/components/PhotoGallery';

// Internal component that securely fetches data using the numeric event ID from URL params
function EventDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch event details and its photos concurrently using the id
      Promise.all([getEventById(id), getEventPhotos(id)])
        .then(([eventData, photosData]) => {
          setEvent(eventData);
          setPhotos(photosData);
        })
        .catch((err) => setError(err.message || 'Error al cargar la información del evento'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="animate-pulse text-lg">Cargando evento y fotografías...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-neutral-950 text-red-400 flex flex-col justify-center items-center gap-4">
        <p>{error || 'Evento no encontrado'}</p>
        <button
          onClick={() => router.push('/events')}
          className="text-xs text-neutral-300 hover:text-white underline"
        >
          Volver a ingresar un código
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Event details card */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Evento Privado
              </span>
              <h1 className="text-3xl font-extrabold mt-1">{event.title}</h1>
            </div>
            <button
              onClick={() => router.push('/events')}
              className="text-xs text-neutral-400 hover:text-white underline"
            >
              Cambiar código
            </button>
          </div>

          <p className="text-xs text-neutral-400 mb-4">Fecha del evento: {event.eventDate}</p>
          <p className="text-neutral-300 leading-relaxed mb-8">{event.description}</p>

          <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-neutral-400">
              Estado: <strong className="text-green-400">Galería disponible</strong> ({photos.length} fotos)
            </span>
          </div>
        </div>

        {/* Photo gallery preview section */}
        <section className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-3">
            Previsualización de Fotos
          </h2>

          {photos.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              No hay fotografías subidas para este evento aún.
            </div>
          ) : (
            <PhotoGallery photos={photos} />
          )}
        </section>

      </div>
    </main>
  );
}

// Main exported page wrapped in Suspense to satisfy Next.js hook requirements
export default function EventDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="animate-pulse text-lg">Cargando...</p>
      </div>
    }>
      <EventDetailContent />
    </Suspense>
  );
}