'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGalleryByCode } from '@/services/api';

export default function EventsPage() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Ensure loading state is always reset when mounting this page
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Validate access code against the backend API
      const data = await getGalleryByCode(accessCode.trim());
      
      // Redirect securely to the event detail page using its ID
      router.push(`/events/${data.id}`);
      
    } catch (err: any) {
      // Handle errors and reset loading state so the user can try again
      setError(err.message || 'Código no válido o el evento no existe.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-extrabold mb-2">Acceso a Eventos</h1>
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
    </main>
  );
}