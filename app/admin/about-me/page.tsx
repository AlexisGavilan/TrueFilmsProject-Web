'use client';

import { useEffect, useState } from 'react';

export interface AboutMeData {
  id?: number;
  heroImageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  galleryImages: string[];
}

export default function AdminAboutMePage() {
  const [loading, setLoading] = useState(true);
  const [savingTexts, setSavingTexts] = useState(false);

  // Estados del formulario
  const [title, setTitle] = useState('Quien soy?');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  
  // URLs actuales recibidas del backend
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(['', '', '', '']);

  // Control de subida de archivos puntuales
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutMeData();
  }, []);

  const fetchAboutMeData = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/about-me');
      if (res.ok) {
        const data: AboutMeData = await res.json();
        setTitle(data.title || 'Quien soy?');
        setSubtitle(data.subtitle || '');
        setDescription(data.description || '');
        setHeroImageUrl(data.heroImageUrl || '');
        setGalleryImages(data.galleryImages || ['', '', '', '']);
      }
    } catch (err) {
      console.error('Error al cargar datos de Sobre Mí:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar títulos y descripción
  const handleSaveTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingTexts(true);
      const res = await fetch('http://localhost:8080/api/admin/about-me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          heroImageUrl,
          galleryImages,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar textos');
      alert('Textos actualizados con éxito');
    } catch (err) {
      alert('Error al guardar los cambios');
    } finally {
      setSavingTexts(false);
    }
  };

  // Subir archivo de imagen para un Slot específico ('hero', 'gallery-1', etc.)
  const handleImageUpload = async (slot: string, file: File) => {
    try {
      setUploadingSlot(slot);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`http://localhost:8080/api/admin/about-me/images/${slot}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir la imagen');
      
      const updatedData: AboutMeData = await res.json();
      setHeroImageUrl(updatedData.heroImageUrl);
      setGalleryImages(updatedData.galleryImages);
      alert(`Imagen del slot [${slot}] actualizada correctamente.`);
    } catch (err) {
      alert('Fallo al subir la imagen');
    } finally {
      setUploadingSlot(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-neutral-500">Cargando configuración de Sobre Mí...</div>;
  }

  const gallerySlots = [
    { slot: 'gallery-1', label: 'Foto Inferior 1', idx: 0 },
    { slot: 'gallery-2', label: 'Foto Inferior 2', idx: 1 },
    { slot: 'gallery-3', label: 'Foto Inferior 3', idx: 2 },
    { slot: 'gallery-4', label: 'Foto Inferior 4', idx: 3 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Personalización de "Sobre Mí"</h2>
        <p className="text-sm text-neutral-400">
          Edita la foto de portada principal, el bloque de texto y las 4 fotos de la galería inferior.
        </p>
      </div>

      {/* SECCIÓN 1: FOTO PRINCIPAL (HERO) */}
      <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-amber-400 border-b border-neutral-800 pb-2">
          1. Foto Principal de Cabecera (Hero Banner)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="aspect-video bg-neutral-950 rounded border border-neutral-800 overflow-hidden flex items-center justify-center relative">
            {heroImageUrl ? (
              <img
                src={`http://localhost:8080${heroImageUrl}`}
                alt="Cabecera"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-neutral-600">Sin foto asignada</span>
            )}
          </div>
          <div className="md:col-span-2 space-y-3">
            <label className="block text-sm text-neutral-300">Subir nueva imagen de cabecera:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload('hero', e.target.files[0])}
              disabled={uploadingSlot === 'hero'}
              className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
            />
            {uploadingSlot === 'hero' && <p className="text-xs text-amber-400">Subiendo cabecera...</p>}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: FORMULARIO DE TEXTOS */}
      <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-amber-400 border-b border-neutral-800 pb-2">
          2. Textos de la Sección
        </h3>
        <form onSubmit={handleSaveTexts} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Título Principal *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Subtítulo</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej: Fotógrafo aprendiz since 2020"
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Descripción / Historia Personal</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white text-sm"
              placeholder="Escribe aquí tu texto descriptivo..."
            />
          </div>
          <button
            type="submit"
            disabled={savingTexts}
            className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold py-2 px-6 rounded transition"
          >
            {savingTexts ? 'Guardando textos...' : 'Guardar Cambios de Texto'}
          </button>
        </form>
      </section>

      {/* SECCIÓN 3: LAS 4 IMÁGENES INFERIORES */}
      <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-amber-400 border-b border-neutral-800 pb-2">
          3. Galería de 4 Imágenes Inferiores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {gallerySlots.map(({ slot, label, idx }) => {
            const currentUrl = galleryImages[idx];
            return (
              <div key={slot} className="bg-neutral-950 border border-neutral-800 p-3 rounded space-y-3">
                <span className="text-xs font-semibold text-neutral-400">{label}</span>
                <div className="aspect-[3/4] bg-neutral-900 rounded border border-neutral-800 overflow-hidden flex items-center justify-center">
                  {currentUrl ? (
                    <img
                      src={`http://localhost:8080${currentUrl}`}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-neutral-600">Sin foto</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(slot, e.target.files[0])}
                  disabled={uploadingSlot === slot}
                  className="block w-full text-[10px] text-neutral-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-800 file:text-white"
                />
                {uploadingSlot === slot && <p className="text-[10px] text-amber-400">Subiendo...</p>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}