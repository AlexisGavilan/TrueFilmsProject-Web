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
  const id = params?.id as string; // Numeric event ID (e.g., /events/1)
  const router = useRouter();

  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch event details and its photos concurrently using the ID
      Promise.all([getEventById(id), getEventPhotos(id)])
        .then(([eventData, photosData]) => {
          setEvent(eventData);
          setPhotos(photosData);
        })
        .catch((err) => setError(err.message || 'Error loading event information'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <p className="animate-pulse text-lg">Loading event and photographs...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-neutral-950 text-red-400 flex flex-col justify-center items-center gap-4">
        <p>{error || 'Event not found'}</p>
        <button
          onClick={() => router.push('/events')}
          className="text-xs text-neutral-300 hover:text-white underline"
        >
          Back to enter a code
        </button>
      </div>
    );
  }

  // HU-4.1: Format the expiration date nicely in Spanish
  const expirationDate = event?.expiresAt 
    ? new Date(event.expiresAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Event details card */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Private Event
              </span>
              <h1 className="text-3xl font-extrabold mt-1">{event.title}</h1>
            </div>
            <button
              onClick={() => router.push('/events')}
              className="text-xs text-neutral-400 hover:text-white underline"
            >
              Change code
            </button>
          </div>

          <p className="text-xs text-neutral-400 mb-4">Event date: {event.eventDate}</p>
          <p className="text-neutral-300 leading-relaxed mb-6">{event.description}</p>

          {/* HU-4.1: Expiration warning notice */}
          {expirationDate && (
            <div className="p-3 mb-6 text-sm bg-amber-950/40 border border-amber-800/50 text-amber-300 rounded-lg">
              ⚠️ Este contenido y sus fotografías estarán disponibles de forma segura hasta el <strong>{expirationDate}</strong> (límite de 5 días).
            </div>
          )}

          <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-neutral-400">
              Status: <strong className="text-green-400">Gallery available</strong> ({photos.length} photos)
            </span>

            <a
              href={getDownloadUrlByCode(event.accessCode)}
              className="w-full sm:w-auto bg-neutral-100 hover:bg-white text-neutral-900 font-bold py-3 px-6 rounded-lg transition shadow text-center"
            >
              📦 Download Photographs (.zip)
            </a>
          </div>
        </div>

        {/* Photo gallery preview section */}
        <section className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-3">
            Photo Preview
          </h2>

          {photos.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              No photographs uploaded for this event yet.
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
        <p className="animate-pulse text-lg">Loading...</p>
      </div>
    }>
      <EventDetailContent />
    </Suspense>
  );
}