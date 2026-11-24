'use client';

import { useEffect, useState } from 'react';
import {
  getAdminEvents,
  createAdminEvent,
  updateEventAccessCode,
  uploadEventBannerFile,
  deleteAdminEvent,
  getDiskSpace,
  uploadEventZipFile,
  getImageUrl,
  formatBytes,
  AdminEvent,
  DiskSpace,
} from '@/services/api';

export default function AdminPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [diskSpace, setDiskSpace] = useState<DiskSpace | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario de nuevo evento
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [expiresAt, setexpiresAt] = useState<number>(5);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  // Estado para edición rápida de código
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCodeInput, setNewCodeInput] = useState('');

  // Estado para subir imagen del banner desde el equipo
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerVersion, setBannerVersion] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, diskData] = await Promise.all([
        getAdminEvents(),
        getDiskSpace().catch(() => null),
      ]);
      setEvents(eventsData);
      setDiskSpace(diskData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate || !accessCode) return;

    try {
      setCreating(true);

      const newEvent = await createAdminEvent({
        title,
        description,
        eventDate,
        accessCode,
        expiresAt: Number(expiresAt),
      });

      if (selectedFile && newEvent && newEvent.id) {
        await uploadEventZipFile(newEvent.id, selectedFile);
      }

      setTitle('');
      setDescription('');
      setEventDate('');
      setAccessCode('');
      setexpiresAt(5);
      setSelectedFile(null);
      await loadData();
    } catch (err) {
      alert('Error al crear el evento o subir el paquete de fotos');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCode = async (id: number) => {
    if (!newCodeInput.trim()) return;
    try {
      await updateEventAccessCode(id, newCodeInput.trim());
      setEditingId(null);
      setNewCodeInput('');
      await loadData();
    } catch (err) {
      alert('Error al actualizar el código');
    }
  };

  const handleUpdateBanner = async (id: number) => {
    if (!bannerFile) {
      alert('Selecciona una imagen desde tu equipo primero');
      return;
    }

    try {
      setUploadingBanner(true);
      await uploadEventBannerFile(id, bannerFile);
      setEditingBannerId(null);
      setBannerFile(null);
      setBannerVersion((prev) => prev + 1);
      await loadData();
    } catch (err) {
      alert('Error al subir la imagen del banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
    try {
      await deleteAdminEvent(id);
      await loadData();
    } catch (err) {
      alert('Error al eliminar el evento');
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Panel de Administración - Gestión del Fotógrafo</h1>

      {diskSpace && (
        <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Espacio en Disco del Servidor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-neutral-950 p-4 rounded border border-neutral-800">
              <span className="text-sm text-neutral-400">Total</span>
              <p className="text-2xl font-bold">{formatBytes(diskSpace.totalSpaceBytes)}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded border border-neutral-800">
              <span className="text-sm text-neutral-400">Usado</span>
              <p className="text-2xl font-bold text-amber-500">{formatBytes(diskSpace.usedSpaceBytes)}</p>
            </div>
            <div className="bg-neutral-950 p-4 rounded border border-neutral-800">
              <span className="text-sm text-neutral-400">Disponible</span>
              <p className="text-2xl font-bold text-emerald-500">{formatBytes(diskSpace.freeSpaceBytes)}</p>
            </div>
          </div>
          <div className="w-full bg-neutral-950 rounded-full h-4 overflow-hidden border border-neutral-800">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${diskSpace.usagePercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-400 mt-2 text-right">
            Uso actual: {diskSpace.usagePercentage}%
          </p>
        </section>
      )}

      <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Evento y Subir Paquete</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Título del Evento *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Fecha del Evento *</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Código de Acceso Privado *</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Ej: BODA-2026"
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Días de Disponibilidad (Caducidad) *</label>
            <input
              type="number"
              min="1"
              max="60"
              value={expiresAt}
              onChange={(e) => setexpiresAt(Number(e.target.value))}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
              required
            />
            <p className="text-xs text-neutral-500 mt-1">Por defecto 5 días. Pasado este tiempo se borrará automáticamente.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-neutral-400 mb-1">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-neutral-400 mb-1">Paquete de Fotos (.ZIP)</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-neutral-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600"
            />
          </div>
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 rounded transition"
            >
              {creating ? 'Guardando evento y subiendo ZIP...' : 'Crear Evento y Subir Paquete'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Eventos Activos y Códigos de Acceso</h2>
        {loading ? (
          <p className="text-neutral-500">Cargando eventos...</p>
        ) : events.length === 0 ? (
          <p className="text-neutral-500">No hay eventos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                  <th className="p-3">Título</th>
                  <th className="p-3">Fecha del Evento</th>
                  <th className="p-3">Caduca el</th>
                  <th className="p-3">Código de Acceso</th>
                  <th className="p-3">Banner</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt: any) => {
                  const formattedExpiration = evt.expiresAt
                    ? new Date(evt.expiresAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr key={evt.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                      <td className="p-3 font-semibold">{evt.title}</td>
                      <td className="p-3 text-neutral-400">{evt.eventDate}</td>
                      <td className="p-3 text-amber-300 text-sm">{formattedExpiration}</td>
                      <td className="p-3">
                        {editingId === evt.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newCodeInput}
                              onChange={(e) => setNewCodeInput(e.target.value)}
                              className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm text-white w-32"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateCode(evt.id)}
                              className="bg-green-600 hover:bg-green-500 text-xs px-2 py-1 rounded font-bold"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="bg-neutral-700 hover:bg-neutral-600 text-xs px-2 py-1 rounded"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono bg-neutral-800 text-amber-400 px-2 py-1 rounded text-sm border border-neutral-700">
                            {evt.accessCode}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {editingBannerId === evt.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setBannerFile(e.target.files ? e.target.files[0] : null)
                              }
                              className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-300 w-48 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-neutral-700 file:text-white"
                            />
                            <button
                              type="button"
                              disabled={uploadingBanner}
                              onClick={() => handleUpdateBanner(evt.id)}
                              className="bg-green-600 hover:bg-green-500 text-xs px-2 py-1 rounded font-bold disabled:opacity-50"
                            >
                              {uploadingBanner ? 'Subiendo...' : 'Subir'}
                            </button>
                            <button
                              type="button"
                              disabled={uploadingBanner}
                              onClick={() => {
                                setEditingBannerId(null);
                                setBannerFile(null);
                              }}
                              className="bg-neutral-700 hover:bg-neutral-600 text-xs px-2 py-1 rounded disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : evt.bannerImageUrl ? (
                          <img
                            src={`${getImageUrl(evt.bannerImageUrl)}?v=${bannerVersion}`}
                            alt={evt.title}
                            className="h-10 w-24 object-cover rounded border border-neutral-700"
                          />
                        ) : (
                          <span className="text-xs text-neutral-500">Sin banner</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        {editingId !== evt.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(evt.id);
                              setNewCodeInput(evt.accessCode);
                            }}
                            className="text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 rounded border border-neutral-700"
                          >
                            Cambiar Código
                          </button>
                        )}
                        {editingBannerId !== evt.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBannerId(evt.id);
                              setBannerFile(null);
                            }}
                            className="text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 rounded border border-neutral-700"
                          >
                            Cambiar Imagen
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(evt.id)}
                          className="text-sm bg-red-950/80 hover:bg-red-900 text-red-300 px-3 py-1 rounded border border-red-800/50"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}