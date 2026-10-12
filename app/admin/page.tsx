'use client';

import { useEffect, useState } from 'react';
import {
  getAdminEvents,
  createAdminEvent,
  updateEventAccessCode,
  deleteAdminEvent,
  AdminEvent
} from '@/services/api';

export default function AdminPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario de nuevo evento
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [creating, setCreating] = useState(false);

  // Estado para edición rápida de código
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCodeInput, setNewCodeInput] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAdminEvents();
      setEvents(data);
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
      await createAdminEvent({ title, description, eventDate, accessCode });
      setTitle('');
      setDescription('');
      setEventDate('');
      setAccessCode('');
      await loadEvents();
    } catch (err) {
      alert('Error al crear el evento');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCode = async (id: number) => {
    if (!newCodeInput.trim()) return;
    try {
      await updateEventAccessCode(id, newCodeInput);
      setEditingId(null);
      setNewCodeInput('');
      await loadEvents();
    } catch (err) {
      alert('Error al actualizar el código');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
    try {
      await deleteAdminEvent(id);
      await loadEvents();
    } catch (err) {
      alert('Error al eliminar el evento');
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración - Gestión de Códigos</h1>

      {/* Formulario de creación de evento */}
      <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mb-12">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Evento</h2>
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
            <label className="block text-sm text-neutral-400 mb-1">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
            />
          </div>
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 rounded transition"
            >
              {creating ? 'Guardando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </section>

      {/* Tabla/Lista de Eventos y Códigos */}
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
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Código de Acceso</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                    <td className="p-3 font-semibold">{evt.title}</td>
                    <td className="p-3 text-neutral-400">{evt.eventDate}</td>
                    <td className="p-3">
                      {editingId === evt.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={evt.accessCode}
                            onChange={(e) => setNewCodeInput(e.target.value)}
                            className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm text-white w-32"
                          />
                          <button
                            onClick={() => handleUpdateCode(evt.id)}
                            className="bg-green-600 hover:bg-green-500 text-xs px-2 py-1 rounded font-bold"
                          >
                            Guardar
                          </button>
                          <button
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
                    <td className="p-3 text-right space-x-2">
                      {editingId !== evt.id && (
                        <button
                          onClick={() => {
                            setEditingId(evt.id);
                            setNewCodeInput(evt.accessCode);
                          }}
                          className="text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 rounded border border-neutral-700"
                        >
                          Cambiar Código
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="text-sm bg-red-950/80 hover:bg-red-900 text-red-300 px-3 py-1 rounded border border-red-800/50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}